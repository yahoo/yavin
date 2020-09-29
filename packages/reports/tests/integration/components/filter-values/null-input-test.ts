import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { TestContext as Context } from 'ember-test-helpers';
import FilterFragment from 'navi-core/models/bard-request-v2/fragments/filter';
import FragmentFactory from 'navi-core/services/fragment-factory';

interface TestContext extends Context {
  onUpdateFilter(changeSet: Partial<FilterFragment>): void;
  fragmentFactory: FragmentFactory;
  filter: FilterFragment;
}

module('Integration | Component | filter values/null input', function(hooks) {
  setupRenderingTest(hooks);

  test('changing values', async function(this: TestContext, assert) {
    assert.expect(1);

    this.fragmentFactory = this.owner.lookup('service:fragment-factory') as FragmentFactory;
    this.filter = this.fragmentFactory.createFilter('metric', 'bardOne', 'adClicks', {}, 'bet', [1000, 2000]);
    this.onUpdateFilter = (changeSet: Partial<FilterFragment>) => {
      assert.deepEqual(changeSet.values, ['""'], 'When rendering the component, "" is set as the filter value');
    };

    await render(hbs`
      <FilterValues::NullInput
        @filter={{this.filter}}
        @onUpdateFilter={{this.onUpdateFilter}}
      />`);
    debugger;
    // Assert handled in action
  });
});
