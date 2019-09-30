/**
 * Copyright 2019, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import { get } from '@ember/object';
import capitalize from 'lodash/capitalize';

/**
 * Returns formatted message based on error object
 * @function getApiErrorMsg
 * @param {Object} error - error object from ajax service
 * @param {String} defaultMsg - the default message to return
 * @returns {String} formatted error message
 */
export function getApiErrMsg(error: { detail?: any } = {}, defaultMsg: string) {
  let detail = get(error, 'detail');

  if (detail) {
    let errorDetail = detail[0].split(':');
    return capitalize(errorDetail[errorDetail.length - 1].trim());
  }

  return defaultMsg;
}
