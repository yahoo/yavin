import EmberObject from '@ember/object';
import { AsyncQuery } from 'navi-data/adapters/fact-interface';

export default class AsyncQueryElide extends EmberObject implements AsyncQuery {
  init() {
    //kick off request
  }
  requestId = 'call uuid method';
  principalName = 'matt';
  request = {};
  status = QUEUED;
  result = null;
  createdOn = null;
  updatedOn = null;
  then() {}
  cancel() {}
}
