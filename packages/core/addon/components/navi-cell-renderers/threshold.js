/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 * <NaviCellRenderers::Threshold
 *   @data={{this.row}}
 *   @column={{this.column}}
 *   @request={{this.request}}
 * />
 */

import MetricNaviCellRendererComponent from './metric';
import { computed } from '@ember/object';

// TODO: Fix metric-money???????
export default class ThresholdNaviCellRenderer extends MetricNaviCellRendererComponent {
  get extraClasses() {
    return ['table-cell-content', 'threshold', this.valueIndicator].join(' ');
  }

  /**
   * @property {Array} classNameBindings - Binding with component class names
   */
  classNameBindings = ['valueIndicator'];

  /**
   * @property {String} - classname binding to render the actual metric value
   */
  @computed('metricValue')
  get valueIndicator() {
    const { metricValue } = this;
    let indicator = 'neutral';

    if (metricValue > 0) {
      indicator = 'strong';
    }
    if (metricValue < 0) {
      indicator = 'weak';
    }

    return indicator;
  }
}
