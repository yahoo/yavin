/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { get, computed } from '@ember/object';
import Model from 'ember-data/model';
import { fragmentArray } from 'ember-data-model-fragments/attributes';
import { v1 } from 'ember-uuid';
import hasVisualization from 'navi-core/mixins/models/has-visualization';
import { validator, buildValidations } from 'ember-cp-validations';
import { belongsTo } from 'ember-data/relationships';
import attr from 'ember-data/attr';
import Dashboard from 'navi-core/models/dashboard';
import * as moment from 'moment';

const Validations = buildValidations({
  visualization: [validator('belongs-to')],
  request: [validator('belongs-to')],
  title: [
    validator('presence', {
      presence: true,
      ignoreBlank: true,
      message: 'The widget must have a title'
    })
  ]
});

/**
 * Decorator that allows you to mixin validations when using es6 style model classes
 *
 * Usage:
 *
 * import { hasValidations } from 'ember-cp-validations';
 *
 * @hasValidations(Validations)
 * export default class YourModel extends Model {
 *    @attr('string') name
 * };
 *
 *
 * @param validations
 * @returns {decorator}
 */

export function hasValidations(validations: any) {
  return (desc: any) => {
    return {
      ...desc,
      finisher(klass: any) {
        klass.prototype.reopen(validations);

        return klass;
      }
    };
  };
}

@hasValidations(Validations)
export default class DashboardWidget extends Model.extend(hasVisualization) {
  @belongsTo('dashboard')
  dashboard!: Dashboard;

  @attr('string', { defaultValue: 'Untitled Widget' })
  title!: string;

  @attr('moment')
  createdOn!: moment.Moment;

  @attr('moment')
  updatedOn!: moment.Moment;

  requests = fragmentArray('bard-request/request', {
    defaultValue: () => []
  });

  /**
   * Author retrieved from dashboard
   * @property author
   */
  @computed('dashboard')
  get author() {
    return this.dashboard.author;
  }

  /**
   * @property {MF.Fragment} request - first request object
   */
  @computed('requests')
  get request() {
    return get(get(this, 'requests'), 'firstObject');
  }

  /**
   * @property {String} tempId - uuid for unsaved records
   */
  @computed('id')
  get tempId() {
    if (get(this, 'id')) {
      return null;
    }
    return v1();
  }

  /**
   * Clones the model
   *
   * @method clone
   * @returns Object - cloned Dashboard-Widget model
   */
  clone() {
    let clonedWidget = this.toJSON();

    return this.store.createRecord('dashboard-widget', {
      title: clonedWidget.title,
      visualization: this.store.createFragment(clonedWidget.visualization.type, clonedWidget.visualization),
      requests: get(this, 'requests').map((request: any) => request.clone())
    });
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'dashboard-widget': DashboardWidget;
  }
}
