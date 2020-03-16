/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import BaseMetadataTransform from './base-metadata-transform';

export default class TableTransform extends BaseMetadataTransform {
  /**
   * @property {String} type - type of metadata
   * @override
   */
  type = 'table';
}
