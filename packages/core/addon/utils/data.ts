/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import { get } from '@ember/object';
import DataGroup from 'navi-core/utils/classes/data-group';
import maxBy from 'lodash/maxBy';

interface Row {
  dateTime: string;
  [key: string]: string | number;
}
type Rows = Array<Row>;

/**
 * Trim rows to a max of n values, sorted by
 * highest value for given metric.
 *
 * @function topN
 * @param {Array} rows - data rows to trim
 * @param {String} metric - name of metric used for sorting
 * @param {Number} n - max number of rows
 * @returns {Array} - n (or less) rows sorted by metric
 */
export function topN(rows: Rows, metric: string, n: number): Array<object> {
  // @ts-ignore
  let sortedRows = rows.sort((a: object, b: object) => Number(get(b, metric)) - Number(get(a, metric)));

  return sortedRows.slice(0, n);
}

/**
 * Parses data for most recent dateTime value and
 * pulls all rows matching that value.
 *
 * @function mostRecentData
 * @param {Array} rows - rows to parse by dateTime
 * @returns {Array} all data rows containing the most recent dateTime
 */
export function mostRecentData(rows: Rows): Rows {
  let byDate = new DataGroup(rows, (row: Row) => row.dateTime),
    sortedDates = byDate.getKeys().sort(),
    mostRecentDate = sortedDates[sortedDates.length - 1];

  return byDate.getDataForKey(mostRecentDate);
}

/**
 * group rows based on dimensions
 *
 * @function dataByDimensions
 * @param {Array} rows - rows to parse by dimensions
 * @param {Array} dimensionOrder
 * @returns {DataGroup}
 */
export function dataByDimensions(rows: Rows, dimensionOrder: Array<string>) {
  return new DataGroup(rows, (row: Row) => dimensionOrder.map(dimension => row[`${dimension}|id`]).join('|'));
}

/**
 * Parses data for max value by dimensions
 *
 * @function maxDataByDimensions
 * @param {Array} rows - rows to parse by dimensions
 * @param {Array} dimensionOrder
 * @param {String} metric - name of metric used for sorting
 * @returns {Array} all data rows for max value based on dimensions
 */
export function maxDataByDimensions(rows: Rows, dimensionOrder: Array<string>, metric: string): Rows {
  let data = dataByDimensions(rows, dimensionOrder),
    keys = data.getKeys();

  return keys.map(key => maxBy(data.getDataForKey(key), row => Number(row[metric])));
}
