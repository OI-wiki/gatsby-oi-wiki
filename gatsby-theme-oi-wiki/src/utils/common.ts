import pick from 'lodash/pick'
import omit from 'lodash/omit'
import throttle from 'lodash/throttle'
import uniq from 'lodash/uniq'

export type NoopNull = (() => null)

export const noopNull: NoopNull = () => null

// 导出以统一项目内命名
// FIXME: 存在无法准确推断 paths 的问题，暂未找到合适的方式实现（本意是处理这个问题的）
export { pick, omit, throttle, uniq }
