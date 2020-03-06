/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * This service is used to dispatch an action to one or more registered consumers
 */

import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { getWithDefault } from '@ember/object';

export default class ActionDispatcherService extends Service {
  /**
   * @property {Array} consumers - list of consumers to be registered on init
   */
  consumers;

  /**
   * @property {Array} _registeredConsumers - list of registered consumers instances
   */
  _registeredConsumers = [];

  /**
   * Initializes service on creation
   *
   * @method init
   * @returns {Void}
   */
  constructor() {
    super(...arguments);
    getWithDefault(this, 'consumers', []).forEach(consumer => this.registerConsumer(consumer));
  }

  /**
   * Registers a consumer object with the dispatcher service
   *
   * @method registerConsumer
   * @param {String} consumer - fullName of consumer
   * @returns {Void}
   */
  registerConsumer(consumer) {
    this._registeredConsumers.push(getOwner(this).lookup(`consumer:${consumer}`));
  }

  /**
   * Dispatches an action to all of the consumers
   *
   * @method dispatch
   * @param {String} actionType - action type name
   * @param {...*} args - arguments passed to the consumer
   * @returns {Void}
   */
  dispatch(actionType, ...params) {
    this._registeredConsumers.forEach(consumer => consumer.send(actionType, ...params));
  }
}
