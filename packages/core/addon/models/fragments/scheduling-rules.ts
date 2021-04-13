/**
 * Copyright 2021, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import { attr } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';

export default class SchedulingRuleFragment extends Fragment {
  @attr('boolean')
  mustHaveData!: boolean;
}

declare module 'navi-core/models/registry' {
  export interface FragmentRegistry {
    'fragments/scheduling-rules': SchedulingRuleFragment;
  }
}
