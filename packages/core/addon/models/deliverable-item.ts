/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { A as arr } from '@ember/array';
import { computed, get } from '@ember/object';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import DeliveryRule from 'navi-core/models/delivery-rule';

export default class DeliverableItem extends Model {
  @hasMany('deliveryRule', {
    async: true,
    inverse: 'deliveredItem'
  })
  deliveryRules!: Promise<DeliveryRule[]>;

  /**
   * @property {String} modelId - id or tempId of model
   */
  @computed('id', 'tempId')
  get modelId() {
    return get(this, 'id') || get(this, 'tempId');
  }

  /**
   * @property {Model} deliveryRuleForUser - delivery rule model
   */
  @computed('user', 'deliveryRules.[]')
  get deliveryRuleForUser() {
    let userId = get(get(this, 'user').getUser(), 'id');

    return get(this, 'deliveryRules').then((rules: DeliveryRule[]) =>
      arr(rules.filter(rule => rule.get('owner.id') === userId)).get('firstObject')
    );
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    deliverableItem: DeliverableItem;
  }
}
