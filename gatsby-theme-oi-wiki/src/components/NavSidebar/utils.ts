import { StrIndexObj } from '../../types/common'
import trimTrailingSlash from '../../lib/trailingSlash'
import { flattenObject } from '../NavAndDrawer/utils'
import { NodeType, PathListType, TypedPathList } from './types'

const getTabIDFromLocation = (location: string, pathList: StrIndexObj<StrIndexObj>): number => {
  const locationTrimmed = trimTrailingSlash(location)
  for (const v of Object.entries(pathList)) {
    if (Object.values(flattenObject(v[1])).map(v => trimTrailingSlash(v as string)).indexOf(locationTrimmed) > -1) return +v[0]
  }
  return -1
}

function getTypedPathList(pathList: PathListType): TypedPathList {
  const resArray: TypedPathList = []
  for (const i of pathList) {
    const [[name, a]] = Object.entries(i)
    if (typeof a === 'string') {
      resArray.push({ name, path: a, type: NodeType.Leaf })
    } else {
      resArray.push({ name, children: getTypedPathList(a), type: NodeType.NonLeaf })
    }
  }
  return resArray
}

export { getTabIDFromLocation, getTypedPathList }
