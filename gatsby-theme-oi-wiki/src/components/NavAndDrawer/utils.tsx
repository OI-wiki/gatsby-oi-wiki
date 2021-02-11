/**
 * Flatten JS object (keys and values) to a single depth object
 * (ref: https://stackoverflow.com/a/53739792)
 *
 * @param {*} ob
 * @return {*}  {Record<string, unknown>}
 */
export function flattenObject (ob:any) :Record<string, unknown> {
  const toReturn = {}

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

    if ((typeof ob[i]) === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i])
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}