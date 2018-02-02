/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Formats having operator
 *
 *  gt  -> >
 *  gte -> >=
 *  lt  -> <
 *  lte -> <=
 *  eq  -> =
 *  neq -> !=
 *
 */
import Ember from 'ember';
import HavingOperations from 'navi-reports/utils/enums/having-operators';

export function formatHavingOperator([operator]) {
  return HavingOperations.findBy('id', operator).name;
}

export default Ember.Helper.helper(formatHavingOperator);
