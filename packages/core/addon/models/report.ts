/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { inject as service } from '@ember/service';
import { A as arr } from '@ember/array';
import { computed, get } from '@ember/object';
import { belongsTo } from 'ember-data/relationships';
import { fragment } from 'ember-data-model-fragments/attributes';
import DeliverableItem from 'navi-core/models/deliverable-item';
import { v1 } from 'ember-uuid';
import hasVisualization from 'navi-core/mixins/models/has-visualization';
import { validator, buildValidations } from 'ember-cp-validations';
import attr from 'ember-data/attr';
import { default as UserModel } from 'navi-core/models/user';
import { default as UserService } from 'navi-core/services/user';

const Validations = buildValidations({
  visualization: [validator('belongs-to')],
  request: [validator('belongs-to')],
  title: [
    validator('presence', {
      presence: true,
      ignoreBlank: true,
      message: 'The report must have a title'
    })
  ]
});

export default class Report extends DeliverableItem.extend(hasVisualization, Validations) {
  /* == Attributes == */
  @attr('string', { defaultValue: 'Untitled Report' }) title!: string;
  @attr('moment') createdOn: any;
  @attr('moment') updatedOn: any;

  @belongsTo('user', { async: true }) author!: UserModel;

  request = fragment('bard-request/request', { defaultValue: {} });

  /**
   * @property {String} tempId - uuid for unsaved records
   */
  tempId = computed('id', function() {
    if (get(this, 'id')) {
      return null;
    } else {
      return v1();
    }
  });

  /**
   * @property {Service} user
   */
  @service('user') user!: UserService;

  /**
   * @property {Boolean} isOwner - is owner of report
   */
  isOwner = computed(function() {
    let user = get(this, 'user').getUser();
    return get(this, 'author.id') === get(user, 'id');
  });

  /**
   * @property {Boolean} isFavorite - is favorite of author
   */
  isFavorite = computed(function() {
    let user = get(this, 'user').getUser(),
      favoriteReports = user.hasMany('favoriteReports').ids();

    return arr(favoriteReports).includes(get(this, 'id'));
  }).volatile();

  /**
   * Clones the model
   *
   * @method clone
   * @returns Object - cloned Report model
   */
  clone(this: any) {
    let clonedReport = this.toJSON();

    return {
      title: clonedReport.title,
      visualization: this.store.createFragment(clonedReport.visualization.type, clonedReport.visualization),
      request: get(this, 'request').clone()
    };
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    report: Report;
  }
}
