/**
 * Copyright 2021, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * This is a sample search provider.
 */
import NaviBaseSearchProviderService from 'navi-search/services/navi-base-search-provider';
import { task } from 'ember-concurrency';
import Response from 'ember-cli-mirage/response';

export default class NaviSampleSearchProviderService extends NaviBaseSearchProviderService {
  /**
   * @method search – Sample search method
   * @param {String} query
   * @returns {Object} Object containing results and dislay component
   */
  @task({ restartable: true })
  *search(query) {
    let data = yield new Promise(function (resolve, reject) {
      let payload = [];
      if (query.toLowerCase().includes('sample')) {
        payload = ['Revenue result', 'Revenue success'];
      } else if (query.toLowerCase().includes('error')) {
        reject(new Response(403));
      }
      resolve(payload);
    });
    return {
      component: 'navi-search-result/sample',
      title: 'Sample',
      data,
    };
  }
}
