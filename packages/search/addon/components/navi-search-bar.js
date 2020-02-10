import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NaviSearchBarComponent extends Component {
  @service('navi-search-provider') searchProvider;

  @tracked searchQuery;
  @tracked searchResults = [];

  searchProviders = this.searchProvider.all();

  @action
  async search() {
    this.searchResults = await Promise.all(
      this.searchProviders.map(provider => {
        return {
          title: provider.name,
          component: provider.associatedComponent,
          data: provider.search(this.searchQuery)
        };
      })
    );
  }
}
