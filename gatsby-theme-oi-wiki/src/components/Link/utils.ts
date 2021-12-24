export type Position = Pick<DOMRect, 'x' | 'y'>

/**
 * 获取元素的绝对位置坐标（相对于浏览器视区左上角）
 */
export const getElementViewPosition = (el: HTMLElement): Position => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x || rect.top,
    y: rect.y || rect.bottom,
  };
};

export type Size = Pick<DOMRect, 'width' | 'height'>

export function getElementSize(el: HTMLElement): Size {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}
