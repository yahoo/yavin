/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';
import DS from 'ember-data';

export default class BaseMetadataTransform extends DS.Transform {
  /**
   * @property {Service} metadataService
   */
  @service('bard-metadata') metadataService;

  /**
   * @property {String} type - type of transform
   */
  type;

  /**
   * @method deserialize
   *
   * Deserializes to a Ember Object or Array of Ember objects
   *
   * @param {String|Array} serialized
   * @returns {Object|Array} Ember Object | Array of Ember Objects
   */
  deserialize(serialized) {
    const { metadataService, type } = this;

    if (isArray(serialized)) {
      return serialized.map(dimension => metadataService.getById(type, dimension));
    }

    return metadataService.getById(type, serialized);
  }

  /**
   * @method serialize
   *
   * Serialized to a string or array of strings
   *
   * @param {Object|Array} deserialized
   * @returns {String|Array|Null} - name | array of names
   */
  serialize(deserialized = {}) {
    if (typeof deserialized === 'string') {
      return deserialized;
    }

    if (isArray(deserialized)) {
      return deserialized.map(item => item.name || null);
    }

    return deserialized.name || null;
  }
}
