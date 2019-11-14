/**
 * Copyright 2019, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Description: The adapter for the bard-facts model.
 */

import { assert, warn } from '@ember/debug';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import config from 'ember-get-config';
import { canonicalizeMetric, getAliasedMetrics, canonicalizeAlias } from '../utils/metric';

const SORT_DIRECTIONS = ['desc', 'asc'];

export default class BardFacts extends EmberObject implements NaviFactAdapter {
  namespace = 'v1/data';

  @service
  private ajax: any;

  @service
  private requestDecorator: any;

  /**
   * Builds the dimensions path for a request
   */
  private _buildDimensionsPath({ dimensions }: NaviRequest /*options*/): string {
    return `${(dimensions || []).map(d => d.dimension).join('/')}`;
  }

  /**
   * Builds a dateTime param string for a request
   */
  private _buildDateTimeParam({ intervals }: NaviRequest): string {
    return intervals
      .map(interval => {
        return `${interval.start}/${interval.end}`;
      })
      .join(',');
  }

  /**
   * Builds a metrics param string for a request
   */
  private _buildMetricsParam({ metrics }: NaviRequest): string {
    return metrics.map(canonicalizeMetric).join(',');
  }

  /**
   * Builds a filters param string for a request
   */
  private _buildFiltersParam({ filters }: NaviRequest): string | undefined {
    return (
      (filters || [])
        .map(({ dimension, operator, values = [], field = 'id' }) => {
          return `${dimension}|${field}-${operator}[${values}]`;
        })
        .join(',') || undefined
    );
  }

  /**
   * Builds a sort param string for a request
   */
  private _buildSortParam({ sort }: NaviRequest, aliasFunction = (a: string) => a): string | undefined {
    return (
      (sort || [])
        .map(s => {
          const { metric: rawMetric, direction = 'desc' } = s;
          const metric = aliasFunction(rawMetric);
          assert(
            `'${direction}' is not a valid sort direction (${SORT_DIRECTIONS.join()})`,
            SORT_DIRECTIONS.indexOf(direction) !== -1
          );

          return `${metric}|${direction}`;
        })
        .join(',') || undefined
    );
  }

  /**
   * Builds a having param string for a request
   */
  private _buildHavingParam({ having }: NaviRequest, aliasFunction = (a: string) => a): string | undefined {
    return (
      (having || [])
        .map(h => {
          const { metric: rawMetric, operator, values } = h;
          const metric = aliasFunction(rawMetric);
          return `${metric}-${operator}[${values}]`;
        })
        .join(',') || undefined
    );
  }

  /**
   * Gets host by name in [{name: String, uri: String}]
   * config datastructure in config.navi.dataSources.
   */
  private _getHost(name: string) {
    if (name) {
      const host = config.navi.dataSources.find(dataSource => dataSource.name === name);
      if (host && host.uri) {
        return host.uri;
      }
      warn(`Fact host for ${name} requested but none was found in configuration. Falling back to default`, {
        id: 'navi-fact-host-not-configured'
      });
    }
    return config.navi.dataSources[0].uri;
  }

  /**
   * Builds a URL path for a request
   */
  private _buildURLPath(request: NaviRequest, options: any = {}): string {
    const { dataSourceName = 'facts' } = options;
    const host = this._getHost(dataSourceName);
    const { namespace } = this;
    const { table, timeGrain } = request.logicalTable;
    const dimensions = this._buildDimensionsPath(request);
    return `${host}/${namespace}/${table}/${timeGrain}/${dimensions}`;
  }

  /**
   * Builds a query object for a request
   */
  _buildQuery(request: NaviRequest, options: any): any {
    const query: any = {};
    const aliasMap = getAliasedMetrics(request.metrics);
    const aliasFunction = (alias: string) => canonicalizeAlias(alias, aliasMap);
    const filters = this._buildFiltersParam(request);
    const having = this._buildHavingParam(request, aliasFunction);
    const sort = this._buildSortParam(request, aliasFunction);

    query.dateTime = this._buildDateTimeParam(request);
    query.metrics = this._buildMetricsParam(request);

    if (filters) {
      query.filters = filters;
    }

    if (having) {
      query.having = having;
    }

    if (sort) {
      query.sort = sort;
    }

    //default format
    query.format = 'json';

    if (options) {
      if (options.page && options.perPage) {
        query.page = options.page;
        query.perPage = options.perPage;
      }

      if (options.format) {
        query.format = options.format;
      }

      if (options.cache === false) {
        query._cache = false;
      }

      //catch all query param and add to the query
      if (options.queryParams) {
        Object.assign(query, options.queryParams);
      }
    }

    return query;
  }

  /**
   * Decorate requests
   */
  private _decorate(request: NaviRequest) {
    return this.requestDecorator.applyGlobalDecorators(request);
  }

  /**
   * Returns URL String for a request
   */
  urlForFindQuery(request: NaviRequest, options: any): string {
    // Decorate and translate the request
    const decoratedRequest = this._decorate(request);
    const path = this._buildURLPath(decoratedRequest, options);
    const query = this._buildQuery(decoratedRequest, options);
    const queryStr = Object.entries(query)
      .map(([key, value]: [string, string]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return `${path}?${queryStr}`;
  }

  /**
   * Uses the url generated using the adapter to make an ajax request
   */
  fetchDataForRequest(request: NaviRequest, options: any = {}): Promise<any> {
    // Decorate and translate the request
    const decoratedRequest = this._decorate(request);
    const url = this._buildURLPath(decoratedRequest, options);
    const query = this._buildQuery(decoratedRequest, options);
    let timeout = 600000;
    let clientId = 'UI';
    let customHeaders: any = {};

    // Support custom clientid header
    if (options && options.clientId) {
      clientId = options.clientId;
    }

    // Support custom timeout
    if (options && options.timeout) {
      timeout = options.timeout;
    }

    // Support custom headers
    if (options && options.customHeaders) {
      customHeaders = options.customHeaders;
    }

    return this.ajax.request(url, {
      xhrFields: {
        withCredentials: true
      },
      beforeSend(xhr: any) {
        xhr.setRequestHeader('clientid', clientId);
        Object.keys(customHeaders).forEach(name => xhr.setRequestHeader(name, customHeaders[name]));
      },
      crossDomain: true,
      data: query,
      timeout: timeout
    });
  }
}
