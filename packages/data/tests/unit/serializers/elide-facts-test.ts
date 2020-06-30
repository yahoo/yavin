import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import NaviFactSerializer from 'navi-data/serializers/fact-interface';
import { AsyncQueryResponse, QueryStatus, QueryResultType, RequestV1 } from 'navi-data/adapters/fact-interface';

const payload: AsyncQueryResponse = {
  asyncQuery: {
    edges: [
      {
        node: {
          id: 'c7d2fe70-b63f-11ea-b45b-bf754c72eca6',
          query: '"{ "query": "{ starmap_monthly_presto_view { edges { node { datestamp user_count } } } } " }',
          status: QueryStatus.COMPLETE,
          result: {
            contentLength: 129,
            httpStatus: 200,
            resultType: QueryResultType.EMBEDDED,
            responseBody:
              '{"data":{"tableA":{"edges":[{"node":{"datestamp":"202003", "userCount":10}},{"node":{"datestamp":"202004", "userCount":20}}]}}}'
          }
        }
      }
    ]
  }
};

let Serializer: NaviFactSerializer;

module('Unit | Serializer | elide facts', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function(this: TODO) {
    Serializer = this.owner.lookup('serializer:elide-facts');
  });

  test('it normalizes a elide fact response', function(assert) {
    const request: RequestV1 = {
      metrics: [
        {
          metric: 'user_count',
          parameters: {}
        }
      ],
      logicalTable: {
        table: 'tableA',
        timeGrain: 'month'
      }
    };
    const normalized = Serializer.normalize(payload, request);

    assert.deepEqual(
      normalized,
      {
        meta: {},
        rows: [
          {
            datestamp: '202003',
            userCount: 10
          },
          {
            datestamp: '202004',
            userCount: 20
          }
        ]
      },
      'normalize transforms the elide raw response into ResponseV1'
    );
  });

  test('it handles empty elide response', function(assert) {
    const request: RequestV1 = {
      metrics: [
        {
          metric: 'user_count',
          parameters: {}
        }
      ],
      logicalTable: {
        table: 'tableA',
        timeGrain: 'month'
      }
    };
    const normalized = Serializer.normalize(null, request);

    assert.deepEqual(normalized, undefined, 'normalize returns undefined when given an empty response');
  });
});
