/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default class User extends Model {
  @hasMany('report', { async: true, inverse: 'author' })
  reports: any;

  @hasMany('report', { async: true, inverse: null })
  favoriteReports: any;

  @hasMany('deliveryRule', { async: true, inverse: 'owner' })
  deliveryRules: any;

  @hasMany('dashboard', { async: true, inverse: 'author' })
  dashboards: any;

  @hasMany('dashboard', { async: true, inverse: null })
  favoriteDashboards: any;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: User;
  }
}
