/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import ActionDispatcher from 'navi-core/services/action-dispatcher';

export const DeliveryRuleActions = Object.assign(
  {},
  {
    DELETE_DELIVERY_RULE: 'deleteDeliveryRule',
    REVERT_DELIVERY_RULE: 'revertDeliveryRule',
    SAVE_DELIVERY_RULE: 'saveDeliveryRule'
  }
);

export default class DeliveryRuleActionDispacter extends ActionDispatcher {
  /**
   * @property {Array} consumers
   */
  get consumers() {
    return ['delivery-rule'];
  }
}
