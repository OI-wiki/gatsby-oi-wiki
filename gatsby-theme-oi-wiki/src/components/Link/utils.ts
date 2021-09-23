import { Nullable } from '../../types/common'

export type Position = Pick<DOMRect, 'x' | 'y'>

/**
 * 获取元素的绝对位置坐标（相对于浏览器视区左上角）
 */
export const getElementViewPosition = (el: Nullable<HTMLElement>): Position => {
  if (el === null) {
    return {
      x: 0,
      y: 0,
    }
  } else {
    const rect = el.getBoundingClientRect()
    return {
      x: rect.x || rect.top,
      y: rect.y || rect.bottom,
    }
  }
}

export type Size = Pick<DOMRect, 'width' | 'height'>

export function getElementSize(el: HTMLElement): Size {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  }
}
