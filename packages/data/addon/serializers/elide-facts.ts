/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Description: A serializer for the bard response
 */

import EmberObject from '@ember/object';
import NaviFactSerializer, { ResponseV1 } from './fact-interface';
import { AsyncQueryResponse, RequestV1 } from 'navi-data/adapters/fact-interface';

export default class ElideFactsSerializer extends EmberObject implements NaviFactSerializer {
  normalize(payload: AsyncQueryResponse, request: RequestV1): ResponseV1 | undefined {
    const requestTable: string = request.logicalTable.table;
    const responseStr = payload?.asyncQuery.edges[0].node.result?.responseBody;
    if (responseStr) {
      const response = JSON.parse(responseStr);
      const rawRows = response.data[requestTable].edges;
      const rows: Array<TODO> = rawRows.map((node: { node: TODO }) => {
        return node.node;
      });
      return {
        rows,
        meta: {}
      };
    }
    return undefined;
  }
}
