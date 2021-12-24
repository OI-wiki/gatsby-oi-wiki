import { StrIndexObj } from '../../types/common';

/**
 * Flatten JS object (keys and values) to a single depth object
 * (ref: https://stackoverflow.com/a/53739792)
 */
export function flattenObject(ob: StrIndexObj<any>): StrIndexObj {
  const toReturn: StrIndexObj = {};

  for (const i in ob) {
    if (Object.prototype.hasOwnProperty.call(ob, i)) {
      if ((typeof ob[i]) === 'object' && ob[i] !== null) {
        const flatObject = flattenObject(ob[i]);

        for (const x in flatObject) {
          if (Object.prototype.hasOwnProperty.call(flatObject, x)) {
            toReturn[i + '.' + x] = flatObject[x];
          }
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
  }
  return toReturn;
}
