import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | navi-search-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<NaviSearchBar />`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('click search button', async function(assert) {
    await render(hbs`<NaviSearchBar />`);

    await fillIn('.search-input', 'Hello!');

    await click(find('.search-button'));

    assert.dom('.results').hasText('A search result');
  });
});
