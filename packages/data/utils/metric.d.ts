/**
 * Returns canonicalized name of a paramterized metric
 * @function canonicalizeMetric
 * @param {Object} metric
 * @param {String} metric.metric - metric name
 * @param {Object} metric.parameters - a key: value object of parameters
 */
export declare function canonicalizeMetric(metric: NaviRequestMetric): string;
/**
 * Returns canonicalized name given metric column attributes
 * @function canonicalizeColumnAttributes
 * @param {Object} attributes
 * @param {String} attributes.name - metric name
 * @param {Object} attributes.parameters - a key: value object of parameters
 */
export declare function canonicalizeColumnAttributes(attributes: any): string;
/**
 * @function hasParameters
 *
 * Returns if metric has parameters
 * @function hasParameters
 * @param {Object} obj
 * @param {String} obj.metric - metric name
 * @param {Object} obj.parameters (optional) - a key: value object of parameters
 * @returns {Boolean} true if metric has parameters
 */
export declare function hasParameters(obj?: any): boolean;
/**
 * Returns a seriailzed list of parameters
 * @function serializeParameters
 * @param {Object} obj - a key: value object of parameters
 */
export declare function serializeParameters(obj?: {}): string;
/**
 * Returns a map of aliases to canonicalized metrics to help with alias lookup.
 * @function getAliasedMetrics
 * @param metrics {Array} - list of metric objects from a request
 * @returns {object} - list of canonicalized metric names keyed by alias
 */
export declare function getAliasedMetrics(metrics?: Array<NaviRequestMetric>): {};
/**
 * Returns a canonicalized metric given an alias
 * Needs the alias map from getAliasedMetrics, this setup so can curry it
 * @function canonicalizeAlias
 * @param alias {string} - the alias string
 * @param aliasMap {object} - key value of alias -> canonicalizedName
 * @returns {string} - canonicalised metric, or alias if not found
 */
export declare function canonicalizeAlias(alias: string, aliasMap?: any): any;
/**
 * Returns a metric object given a canonical name
 * @function parseMetricName
 * @param {String} canonicalName - the metric's canonical name
 * @returns {Object} - object with base metric and parameters
 */
export declare function parseMetricName(
  canonicalName: string
): {
  metric: string;
  parameters: {};
};
/**
 * Returns a metric object given column attributes
 * @function mapColumnAttributes
 * @param {Object} attributes - column attributes
 * @param {String} attributes.name - metric name
 * @param {Object} attributes.parameters - metric parameters
 * @returns {Object} - object with metric name and parameters
 */
export declare function mapColumnAttributes(
  attributes: any
): {
  metric: any;
  parameters: any;
};
