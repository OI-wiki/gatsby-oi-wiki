import pick from 'lodash/pick'
import omit from 'lodash/omit'
import throttle from 'lodash/throttle'
import uniq from 'lodash/uniq'

import { StrBool } from '../types/common'

export type IsStrBoolType = ((str: StrBool) => boolean)
export type IsNullType = ((val: any) => boolean)
export type NoopNull = (() => null)

export const isStrTrue: IsStrBoolType = (str) => str === 'true'
export const isStrFalse: IsStrBoolType = (str) => str === 'false'
export const isNull: IsNullType = (val) => val === null
export const noopNull: NoopNull = () => null

// 导出方便 IDE 补全
// FIXME: 存在无法准确推断 paths 的问题，暂未找到合适的方式实现（本意是处理这个问题的）
export { pick, omit, throttle, uniq }
