import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NaviSearchBarComponent extends Component {
  @service('navi-search-provider') searchProvider;

  @tracked searchResults = [];

  searchProviders = this.searchProvider.all();

  @action
  search() {
    this.searchResults = ['Oh hello!'];
  }
}
