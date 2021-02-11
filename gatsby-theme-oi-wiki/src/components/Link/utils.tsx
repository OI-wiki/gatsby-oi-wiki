export type Position = {
  x: number,
  y: number,
}
/**
 * 获取元素的绝对位置坐标（像对于浏览器视区左上角）
 *
 * (https://www.hangge.com/blog/cache/detail_2260.html)
 *
 * @export
 * @param {*} el
 * @return {Position}
 */
export function getElementViewPosition (el: any): Position {
  // 计算x坐标
  let actualLeft = el.offsetLeft
  let current = el.offsetParent
  let elScrollLeft
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft)
    current = current.offsetParent
  }
  if (document.compatMode === 'BackCompat') {
    elScrollLeft = document.body.scrollLeft
  } else {
    elScrollLeft = document.documentElement.scrollLeft
  }
  const left = actualLeft - elScrollLeft
  // 计算y坐标
  let actualTop = el.offsetTop
  current = el.offsetParent
  let elScrollTop
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop)
    current = current.offsetParent
  }
  if (document.compatMode === 'BackCompat') {
    elScrollTop = document.body.scrollTop
  } else {
    elScrollTop = document.documentElement.scrollTop
  }
  const right = actualTop - elScrollTop
  return {
    x: left,
    y: right,
  }
}

export type Size = {
  width: number,
  height: number,
}

export function getElementSize (el: HTMLElement): Size {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  }
}

