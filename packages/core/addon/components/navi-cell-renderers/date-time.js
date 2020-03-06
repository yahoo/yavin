/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 * <NaviCellRenderers::DateTime
 *   @data={{this.row}}
 *   @column={{this.column}}
 *   @request={{this.request}}
 * />
 */

import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import layout from '../../templates/components/navi-cell-renderers/date-time';
import { layout as templateLayout, tagName } from '@ember-decorators/component';

@templateLayout(layout)
@tagName('')
class DateTimeNaviCellRendererComponent extends Component {
  /**
   * @property {String} value
   * Date start time from the response data or 'TOTAL'
   */
  @readOnly('data.dateTime') value;

  /**
   * @property {String} granularity- Time Grain in request
   * Request can be either a model or a serialized form of
   * the model, timeGrain is an interval fragment in the model and a string in the serialized
   * request model
   */
  @computed('request.logicalTable.timeGrain')
  get granularity() {
    const timeGrain = this.request?.logicalTable?.timeGrain;
    return timeGrain?.name || timeGrain;
  }
}

export default DateTimeNaviCellRendererComponent;
