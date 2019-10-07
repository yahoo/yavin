/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import Report from 'navi-core/models/report';
import DeliveryRule from 'navi-core/models/delivery-rule';
import Dashboard from 'navi-core/models/dashboard';

export default class User extends Model {
  @hasMany('report', { async: true, inverse: 'author' })
  reports!: Promise<Report[]>;

  @hasMany('report', { async: true, inverse: null })
  favoriteReports!: Promise<Report[]>;

  @hasMany('deliveryRule', { async: true, inverse: 'owner' })
  deliveryRules!: Promise<DeliveryRule[]>;

  @hasMany('dashboard', { async: true, inverse: 'author' })
  dashboards!: Dashboard[];

  @hasMany('dashboard', { async: true, inverse: null })
  favoriteDashboards!: Dashboard[];
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: User;
  }
}
