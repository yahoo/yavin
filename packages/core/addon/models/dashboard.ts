/**
 * Copyright 2019, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { or } from '@ember/object/computed';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { fragment, fragmentArray } from 'ember-data-model-fragments/attributes';
import DeliverableItem from 'navi-core/models/deliverable-item';
import config from 'ember-get-config';
import { copy } from 'ember-copy';
import { validator, buildValidations } from 'ember-cp-validations';
import { default as UserModel } from 'navi-core/models/user';
import * as moment from 'moment';
import DashboardWidget, { hasValidations } from 'navi-core/models/dashboard-widget';
import { default as UserService } from 'navi-core/services/user';

const Validations = buildValidations({
  title: [
    validator('presence', {
      presence: true,
      ignoreBlank: true,
      message: 'The dashboard must have a title'
    })
  ]
});

@hasValidations(Validations)
export default class Dashboard extends DeliverableItem {
  @belongsTo('user', { async: true }) author!: UserModel;
  @attr('string') title!: string;
  @attr('moment') createdOn!: moment.Moment;
  @attr('moment') updatedOn!: moment.Moment;
  @hasMany('dashboard-widget', { async: true }) widgets!: DashboardWidget[];
  filters = fragmentArray('bard-request/fragments/filter', { defaultValue: [] });
  presentation = fragment('fragments/presentation', {
    defaultValue: () => {
      return {};
    }
  });

  /**
   * @property {Service} user
   */
  @service('user') user!: UserService;

  /**
   * @property {Boolean} isUserOwner - user is the dashboard owner
   */
  isUserOwner = computed('author', function() {
    return get(this, 'author.id') === config.navi.user;
  });

  /**
   * @property {Boolean} isUserEditor - user is in the dashboard editor list
   */
  isUserEditor = false;

  /**
   * @property {Boolean} canUserEdit - user has edit permissions for dashboard
   */
  @or('isUserOwner', 'isUserEditor')
  canUserEdit!: boolean;

  /**
   * @property {Boolean} isFavorite - is favorite of author
   */
  get isFavorite() {
    let user = get(this, 'user').getUser(),
      favoriteDashboards = user.hasMany('favoriteDashboards').ids();

    return A(favoriteDashboards).includes(get(this, 'id'));
  }

  /**
   * Clones the model
   *
   * @method clone
   * @returns Object - cloned Dashboard model
   */
  clone() {
    let user = get(this, 'user').getUser(),
      clonedDashboard = Object.assign(this.toJSON(), {
        author: user,
        widgets: [],
        filters: this.get('filters').map((filter: any) =>
          this.store.createFragment('bard-request/fragments/filter', filter.toJSON())
        ),
        presentation: copy(get(this, 'presentation')),
        createdOn: null,
        updatedOn: null
      });

    return this.store.createRecord('dashboard', clonedDashboard);
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    dashboard: Dashboard;
  }
}
