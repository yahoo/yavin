import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NaviSearchBarComponent extends Component {
  @service('navi-search-result') searchResultService;

  @tracked searchQuery;
  @tracked searchProviders = this.searchResultService.all();

  @action
  async search() {}
}
