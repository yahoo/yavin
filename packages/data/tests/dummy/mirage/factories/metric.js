import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  index(i) {
    return i;
  },
  id() {
    return `metric${this.index}`;
  },
  name() {
    return `Metric ${this.index}`;
  },
  description() {
    return `This is metric ${this.index}`;
  },
  category: 'categoryOne',
  valueType: 'NUMBER',
  tags() {
    return ['DISPLAY'];
  },
  defaultFormat: 'number'
});
