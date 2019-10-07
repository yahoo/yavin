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

export default class DashboardWidget extends Model.extend(hasVisualization, Validations) {
  @belongsTo('dashboard') dashboard!: Dashboard;
  @attr('string', { defaultValue: 'Untitled Widget' }) title!: string;
  @attr('moment') createdOn!: moment.Moment;
  @attr('moment') updatedOn!: moment.Moment;
  requests = fragmentArray('bard-request/request', {
    defaultValue: () => []
  });

  /**
   * Author retrieved from dashboard
   * @property author
   */
  author = computed('dashboard', function(): string {
    return get(this, 'dashboard.author');
  });

  /**
   * @property {MF.Fragment} request - first request object
   */
  request = computed('requests', function() {
    return get(this, 'requests.firstObject');
  });

  /**
   * @property {String} tempId - uuid for unsaved records
   */
  tempId = computed('id', function(): string | null {
    if (get(this, 'id')) {
      return null;
    } else {
      return v1();
    }
  });

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
