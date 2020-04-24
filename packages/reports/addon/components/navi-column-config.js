/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 *  <NaviColumnConfig
 *    @isOpen={{true}}
 *    @drawerDidChange={{this.callback}}
 *    @report={{@report}}
 *    @openFilters={{route-action "openFilters"}}
 *    @onRemoveDateTime={{update-report-action "REMOVE_TIME_GRAIN"}}
 *    @onRemoveDimension={{update-report-action "REMOVE_DIMENSION_FRAGMENT"}}
 *    @onRemoveMetric={{update-report-action "REMOVE_METRIC_FRAGMENT"}}
 *    @onAddDimension={{update-report-action "ADD_DIMENSION"}}
 *    @onAddMetric={{update-report-action "ADD_METRIC"}}
 *    @onAddMetricWithParameter={{update-report-action "ADD_METRIC_WITH_PARAM"}}
 *    @onToggleDimFilter={{update-report-action "TOGGLE_DIM_FILTER"}}
 *    @onToggleMetricFilter={{update-report-action "TOGGLE_METRIC_FILTER"}}
 *    @onToggleParameterizedMetricFilter={{update-report-action "TOGGLE_PARAMETERIZED_METRIC_FILTER"}}
 *  />
 */
import Component from '@ember/component';
import layout from '../templates/components/navi-column-config';
import { action, computed } from '@ember/object';
import { capitalize } from '@ember/string';
import move from 'ember-animated/motions/move';
import { easeOut, easeIn } from 'ember-animated/easings/cosine';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { layout as templateLayout, tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

@tagName('')
@templateLayout(layout)
class NaviColumnConfig extends Component {
  /**
   * @property fadeTransition - fade transition
   */
  *transition({ keptSprites, removedSprites, insertedSprites }) {
    let moveDuration;
    if (removedSprites.length > 0) {
      // when removing an item, we want to quickly fill in the gap
      moveDuration = 50;
    }

    yield Promise.all([
      ...keptSprites.map(sprite => move(sprite, { duration: moveDuration })),
      ...insertedSprites.map(sprite => fadeIn(sprite, { duration: 100 })),
      ...removedSprites.map(sprite => fadeOut(sprite, { duration: 0 }))
    ]);
  }

  /**
   * @property {Object[]} columns - date time (if not all), dimension, and metric columns from the request
   */
  @computed(
    'report.request.{metrics.@each.parameters,dimensions.[],filters.[],having.[],logicalTable.timeGrain}',
    'report.visualization'
  )
  get columns() {
    const { request, visualization } = this.report;
    const {
      metrics,
      dimensions,
      filters,
      having,
      logicalTable: {
        timeGrain,
        table: { timeGrains }
      }
    } = request;
    const timeGrainObject = timeGrains.find(grain => grain.id === timeGrain) || {};

    const filteredDimensions = filters.toArray().map(f => f.dimension.id);
    const filteredMetrics = having.toArray().map(h => h.metric.canonicalName);

    const dimensionColumns = dimensions.toArray().map(dimension => {
      const { id: name } = dimension.dimension;
      return {
        type: 'dimension',
        name,
        displayName: this.getDisplayName(dimension, 'dimension', visualization),
        isFiltered: filteredDimensions.includes(name),
        fragment: dimension
      };
    });

    const metricColumns = metrics.toArray().map(metric => {
      const name = metric.canonicalName;
      return {
        type: 'metric',
        name,
        displayName: this.getDisplayName(metric, 'metric', visualization),
        isFiltered: filteredMetrics.includes(name),
        fragment: metric
      };
    });

    const columns = [...dimensionColumns, ...metricColumns];

    if (timeGrain !== 'all') {
      columns.unshift({
        type: 'timeDimension',
        name: 'dateTime',
        displayName: this.getDisplayName(timeGrainObject, 'timeDimension', visualization),
        isFiltered: true,
        fragment: 'dateTime',
        timeGrain,
        timeGrains: timeGrains.filter(grain => grain.id !== 'all')
      });
    }

    return columns;
  }

  /**
   * @property {Service} metricName
   */
  @service metricName;

  /**
   * @method getDisplayName
   * @param {Object} column - the column being displayed
   * @param {String} type - the type of column (metric, dimension, timeDimension)
   * @param {Object} visualization - the visualization metadata
   * @returns {String} display name from visualization metadata or default display name for metric, dimension, or Date
   */
  getDisplayName(column, type, visualization) {
    const visMetaData = visualization.metadata.style || {};
    const nameServiceMap = {
      // TODO: Add namespace pararemeter when metricName service supports it
      metric: metric => this.metricName.getDisplayName(metric.serialize()),
      dimension: dimension => dimension.dimension.name || dimension.dimension.id,
      timeDimension: timeGrain => `Date Time (${timeGrain.name})`
    };

    const ID_FIELD_MAP = {
      metric: metric => metric.canonicalName,
      dimension: dimension => dimension.dimension.id,
      timeDimension: timeDimension => timeDimension.name
    };

    const alias = visMetaData.aliases?.find(alias => alias.name === ID_FIELD_MAP[type](column) && alias.type === type);

    return alias?.as || nameServiceMap[type](column);
  }

  /**
   * Makes a copy of the metrics parameters e.g { currency: USD }
   * @method _cloneMetricParams
   * @param {Object} metricColumn - a metric column
   */
  _cloneMetricParams(metricColumn) {
    return metricColumn.metric.arguments.reduce((params, arg) => {
      params[arg.id] = metricColumn.parameters[arg.id];
      return params;
    }, {});
  }

  /**
   * Adds a copy of the given column to the request including its parameters
   * @action
   * @param {Object} column - The metric/dimension column to make a copy of
   */
  @action
  cloneColumn(column) {
    const { type, fragment } = column;

    const newColumn = fragment[type];
    if (type === 'metric') {
      if (newColumn.hasParameters) {
        this.onAddMetricWithParameter?.(newColumn, this._cloneMetricParams(column.fragment));
      } else {
        this.onAddMetric?.(newColumn);
      }
    } else if (type === 'dimension') {
      this.onAddDimension?.(newColumn);
    }
  }

  /**
   * Adds/removes a filter for the given column including its parameters
   * @action
   * @param {Object} column  - The metric/dimension to add a filter for
   */
  @action
  toggleColumnFilter(column) {
    const { type, fragment } = column;

    const oldFilters = this.report.request.filters.length + this.report.request.having.length;
    const newColumn = fragment[type];
    if (type === 'metric') {
      if (newColumn.hasParameters) {
        this.onToggleParameterizedMetricFilter?.(newColumn, this._cloneMetricParams(column.fragment));
      } else {
        this.onToggleMetricFilter?.(newColumn);
      }
    } else if (type === 'dimension') {
      this.onToggleDimFilter?.(newColumn);
    }
    const newFilters = this.report.request.filters.length + this.report.request.having.length;

    if (newFilters > oldFilters) {
      // If we added a filter/having we should open the filters
      this.openFilters?.();
    }
  }

  /**
   * @action
   * @param {Object} column - contains type and name of column to remove from request
   */
  @action
  removeColumn(column) {
    const { type, fragment, name } = column;
    const removalHandler = this[`onRemove${name === 'dateTime' ? 'DateTime' : capitalize(type)}`];
    removalHandler?.(fragment);
  }

  /**
   * Stores element reference after render
   * @param element - element inserted
   */
  @action
  setupElement(element) {
    this.componentElement = element;
  }

  /**
   * Drawer transition
   * @param context - animation context
   */
  @action
  *drawerTransition({ insertedSprites, removedSprites }) {
    const offset = 500; // 2x the size of the drawer
    const x = this.componentElement.getBoundingClientRect().left - offset;
    yield Promise.all([
      ...removedSprites.map(sprite => {
        sprite.applyStyles({ 'z-index': '1' });
        sprite.endAtPixel({ x });
        return move(sprite, { easing: easeIn });
      }),
      ...insertedSprites.map(sprite => {
        sprite.startAtPixel({ x });
        sprite.applyStyles({ 'z-index': '1' });
        return move(sprite, { easing: easeOut });
      })
    ]);
    this.drawerDidChange?.();
  }
}
export default NaviColumnConfig;
