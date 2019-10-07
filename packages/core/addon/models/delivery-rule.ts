/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { validator, buildValidations } from 'ember-cp-validations';
import { fragment } from 'ember-data-model-fragments/attributes';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';
import attr from 'ember-data/attr';
import User from 'navi-core/models/user';
import * as moment from 'moment';
import DeliverableItem from 'navi-core/models/deliverable-item';

const Validations = buildValidations({
  frequency: [
    validator('presence', {
      presence: true,
      message: 'Please select a delivery frequency'
    })
  ],
  format: [
    validator('presence', {
      presence: true,
      message: 'Please select a delivery format'
    })
  ],
  recipients: [
    validator('recipients', {
      noRecipientsMsg: 'There must be at least one recipient',
      invalidEmailMsg: 'Not all recipients are valid email addresses'
    })
  ]
});

export default class DeliveryRule extends Model.extend(Validations) {
  /* == Attributes == */
  @attr('moment') createdOn!: moment.Moment;
  @attr('moment') updatedOn!: moment.Moment;
  @attr('string', { defaultValue: 'report' }) deliveryType!: string;

  @attr('string', { defaultValue: 'week' }) frequency!: string;

  schedulingRules = fragment('fragments/scheduling-rules', {
    defaultValue: () => {
      return { mustHaveData: false };
    }
  });
  @attr({ defaultValue: () => {} }) format: any;
  @attr({ defaultValue: () => [] }) recipients: any;
  @attr('number', { defaultValue: 1 }) version!: number;

  @belongsTo('deliverableItem', {
    async: true,
    inverse: 'deliveryRules',
    polymorphic: true
  })
  deliveredItem!: DeliverableItem;

  @belongsTo('user', { async: true, inverse: 'deliveryRules' })
  owner!: User;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    deliveryRule: DeliveryRule;
  }
}
