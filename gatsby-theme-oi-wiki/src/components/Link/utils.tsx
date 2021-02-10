
export type Position = {
  x: number,
  y: number,
  width: number,
  height: number,
}
/**
 * 获取元素的绝对位置坐标（像对于浏览器视区左上角）
 * 
 * (https://www.hangge.com/blog/cache/detail_2260.html)
 *
 * @export
 * @param {*} element
 * @return {Position} 
 */
export function getElementViewPosition(element): Position {
  console.log('geE', element)
  //计算x坐标
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  let elementScrollLeft;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft);
    current = current.offsetParent;
  }
  if (document.compatMode == "BackCompat") {
    elementScrollLeft = document.body.scrollLeft;
  } else {
    elementScrollLeft = document.documentElement.scrollLeft;
  }
  let left = actualLeft - elementScrollLeft;
  //计算y坐标
  let actualTop = element.offsetTop;
  current = element.offsetParent;
  let elementScrollTop;
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop);
    current = current.offsetParent;
  }
  if (document.compatMode == "BackCompat") {
    elementScrollTop = document.body.scrollTop;
  } else {
    elementScrollTop = document.documentElement.scrollTop;
  }
  let right = actualTop - elementScrollTop;
  return {
    x: left,
    y: right,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}
