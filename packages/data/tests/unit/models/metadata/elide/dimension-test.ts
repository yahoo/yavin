import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import ElideDimensionMetadataModel, { ElideDimensionMetadataPayload } from 'navi-data/models/metadata/elide/dimension';
import type { Factory } from 'navi-data/models/native-with-create';

let PayloadBase: ElideDimensionMetadataPayload;
let DimensionFactory: Factory<typeof ElideDimensionMetadataModel>;

module('Unit | Model | metadata/elide/dimension', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    PayloadBase = {
      id: 'dim',
      name: 'Dimension',
      source: 'elideOne',
      valueType: 'text',
      isSortable: false,
      type: 'formula',
      tableSource: undefined,
      valueSourceType: 'ENUM',
      cardinality: undefined,
      values: [],
    };

    DimensionFactory = this.owner.factoryFor('model:metadata/elide/dimension');
  });

  test('it properly hydrates properties', function (assert) {
    const Model = DimensionFactory.create(PayloadBase);
    assert.deepEqual(Model.valueSourceType, 'ENUM', 'valueSourceType property is hydrated properly');
    assert.deepEqual(Model.hasEnumValues, true, 'hasEnumValues property is hydrated properly');
    assert.deepEqual(Model.values, [], 'values property is hydrated properly');
    assert.deepEqual(Model.cardinality, 'SMALL', 'cardinality property defaults to small if enum values are used');
    assert.deepEqual(Model.tableSource, undefined, 'tableSource property is hydrated properly');
    assert.deepEqual(Model.valueSource, Model, 'valueSource property is hydrated properly');

    const ModelWithCardinality = DimensionFactory.create({ ...PayloadBase, cardinality: 'MEDIUM' });
    assert.deepEqual(ModelWithCardinality.cardinality, 'MEDIUM', 'cardinality property is not overridden if provided');
  });

  test('it looks up tableSource', function (assert) {
    assert.expect(4);

    const Model = DimensionFactory.create({
      ...PayloadBase,
      valueSourceType: 'TABLE',
      tableSource: {
        valueSource: 'tableName.field',
        suggestionColumns: [],
      },
    });
    const fakeLookup = ({ fake: true } as unknown) as ElideDimensionMetadataModel;
    Model['naviMetadata'] = {
      //@ts-expect-error
      getById(type, id, dataSourceName) {
        assert.deepEqual(type, 'dimension', 'Looks up column as dimension');
        assert.deepEqual(id, Model.tableSource?.valueSource, 'Looks up column using table source');
        assert.deepEqual(dataSourceName, Model.source, 'Looks up column using current datasource');
        return fakeLookup;
      },
    };

    assert.deepEqual(Model.valueSource, fakeLookup, 'The lookup column returns the linked dimension');
  });
});
