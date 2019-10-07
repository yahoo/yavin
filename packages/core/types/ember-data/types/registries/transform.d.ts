import * as moment from 'moment';

export default interface TransformRegistry {
  // TODO: Probably can dedupe
  string: string;
  boolean: boolean;
  number: number;
  date: Date;
  // Custom formats
  moment: moment.Moment;
}
