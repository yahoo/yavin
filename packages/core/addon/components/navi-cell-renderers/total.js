/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import Component from '@ember/component';
import layout from '../../templates/components/navi-cell-renderers/total';
import { layout as templateLayout, tagName } from '@ember-decorators/component';

@templateLayout(layout)
@tagName('')
class TotalNaviCellRendererComponent extends Component {}

export default TotalNaviCellRendererComponent;
