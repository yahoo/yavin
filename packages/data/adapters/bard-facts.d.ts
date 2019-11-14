/**
 * Copyright 2019, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Description: The adapter for the bard-facts model.
 */
import EmberObject from '@ember/object';
export default class BardFacts extends EmberObject implements NaviFactAdapter {
  namespace: string;
  private ajax;
  private requestDecorator;
  /**
   * Builds the dimensions path for a request
   */
  private _buildDimensionsPath;
  /**
   * Builds a dateTime param string for a request
   */
  private _buildDateTimeParam;
  /**
   * Builds a metrics param string for a request
   */
  private _buildMetricsParam;
  /**
   * Builds a filters param string for a request
   */
  private _buildFiltersParam;
  /**
   * Builds a sort param string for a request
   */
  private _buildSortParam;
  /**
   * Builds a having param string for a request
   */
  private _buildHavingParam;
  /**
   * Gets host by name in [{name: String, uri: String}]
   * config datastructure in config.navi.dataSources.
   */
  private _getHost;
  /**
   * Builds a URL path for a request
   */
  private _buildURLPath;
  /**
   * Builds a query object for a request
   */
  _buildQuery(request: NaviRequest, options: any): any;
  /**
   * Decorate requests
   */
  private _decorate;
  /**
   * Returns URL String for a request
   */
  urlForFindQuery(request: NaviRequest, options: any): string;
  /**
   * Uses the url generated using the adapter to make an ajax request
   */
  fetchDataForRequest(request: NaviRequest, options?: any): Promise<any>;
}
