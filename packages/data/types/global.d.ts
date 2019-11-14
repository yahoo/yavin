// Types for compiled templates
declare module 'navi-data/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module 'ember-get-config' {
  const config: {
    navi: {
      dataSources: Array<any>;
    };
  };
  export default config;
}

interface NaviRequestInterval {
  start: string;
  end: string;
}

interface NaviRequestHaving {
  metric: string;
  operator: string;
  values: Array<string>;
}

interface NaviRequestFiter {
  dimension: string;
  operator: string;
  values: Array<string>;
  field: string;
}

interface NaviRequestDimension {
  dimension: string;
}

interface NaviRequestSort {
  metric: string;
  direction: string;
}

interface NaviRequestMetric {
  metric: string;
  parameters: {
    as: string;
  };
}

interface NaviRequestLoicalTable {
  table: string;
  timeGrameName: string;
}

interface NaviRequest {
  logicalTable: any;
  metrics: Array<NaviRequestMetric>;
  dimensions: Array<NaviRequestDimension>;
  filters: Array<NaviRequestFiter>;
  having: Array<NaviRequestHaving>;
  reqponseFormat: string;
  intervals: Array<NaviRequestInterval>;
  sort: Array<NaviRequestSort>;
}
