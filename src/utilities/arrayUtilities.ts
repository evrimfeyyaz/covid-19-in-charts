import _ from 'lodash';

export function hasSameElements<T>(array1: T[], array2: T[]) {
  return _.isEqual(_.sortBy(array1), _.sortBy(array2))
}