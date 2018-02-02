import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import { setupMock, teardownMock } from '../../helpers/mirage-helper';
import wait from 'ember-test-helpers/wait';

const { getOwner } = Ember;

let Store;

moduleForModel('report', 'Unit | Serializer | Report', {
  needs: [
    'serializer:report',
    'adapter:report',
    'adapter:user',
    'model:user',
    'transform:array',
    'transform:fragment-array',
    'transform:dimension',
    'transform:fragment',
    'transform:metric',
    'transform:sort',
    'transform:moment',
    'transform:table',
    'model:bard-request/request',
    'model:bard-request/fragments/dimension',
    'model:bard-request/fragments/filter',
    'model:bard-request/fragments/interval',
    'model:bard-request/fragments/logicalTable',
    'model:bard-request/fragments/metric',
    'model:bard-request/fragments/sort',
    'serializer:bard-request/fragments/logical-table',
    'serializer:bard-request/fragments/interval',
    'validator:length',
    'validator:belongs-to',
    'validator:has-many',
    'validator:interval',
    'validator:presence',
    'validator:chart-type',
    'validator:request-metrics',
    'validator:request-metric-exist',
    'validator:request-dimension-order',
    'service:bard-metadata',
    'adapter:bard-metadata',
    'serializer:report',
    'serializer:user',
    'serializer:bard-metadata',
    'serializer:bard-request/request',
    'service:keg',
    'service:ajax',
    'service:bard-facts',
    'service:user',
    'model:metadata/table',
    'model:metadata/dimension',
    'model:metadata/metric',
    'model:metadata/time-grain',
    'service:bard-dimensions',
    'adapter:dimensions/bard',
    'serializer:visualization',
    'model:line-chart',
    'model:delivery-rule',
    'adapter:delivery-rule',
    'serializer:delivery-rule'
  ],

  beforeEach() {
    setupMock();
    Store = this.store();
    getOwner(this).lookup('service:bard-metadata').loadMetadata();
  },

  afterEach() {
    teardownMock();
  }
});

test('Serializing record', function(assert) {
  assert.expect(3);

  let expectedResult = {
    data: {
      attributes: {
        title: 'Hyrule News',
        request: {
          logicalTable: {
            table: 'network',
            timeGrain: 'day'
          },
          metrics: [
            { metric: 'adClicks' },
            { metric: 'navClicks' }
          ],
          dimensions: [
            { dimension: 'property' }
          ],
          filters: [],
          having: [],
          sort: [
            {
              metric: "navClicks",
              direction: "asc"
            }
          ],
          intervals: [
            {
              end: '2015-11-16 00:00:00.000',
              start: '2015-11-09 00:00:00.000'
            }
          ],
          bardVersion:    'v1',
          requestVersion: 'v1'
        },
        visualization: {
          type: 'line-chart',
          version: 1,
          metadata: {
            axis: {
              y: {
                series: {
                  type: 'dimension',
                  config: {
                    metric: 'adClicks',
                    dimensionOrder: [ 'property' ],
                    dimensions: [
                      {  name: 'Property 1', values: {  property: '114' } },
                      {  name: 'Property 2', values: {  property: '100001' } },
                      {  name: 'Property 3', values: {  property: '100002' } }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      relationships: {
        author: {
          data: {
            type: 'users',
            id: 'navi_user'
          }
        }
      },
      type: 'reports'
    }
  };

  return wait().then(() => {
    return Ember.run(() => {
      return Store.findRecord('report', 1).then(report => {

        assert.ok(report.get('createdOn'),
          'Report model contains "createdOn" attribute');

        assert.ok(report.get('updatedOn'),
          'Report model contains "updatedOn" attribute');

        assert.deepEqual(report.serialize(),
          expectedResult,
          'Serialize method does not serialize createdOn and updatedOn attributes as expected');
      });
    });
  });
});
