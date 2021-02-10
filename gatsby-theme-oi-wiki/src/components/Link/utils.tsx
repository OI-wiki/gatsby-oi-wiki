
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
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft);
    current = current.offsetParent;
  }
  if (document.compatMode == "BackCompat") {
    var elementScrollLeft = document.body.scrollLeft;
  } else {
    var elementScrollLeft = document.documentElement.scrollLeft;
  }
  var left = actualLeft - elementScrollLeft;
  //计算y坐标
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop);
    current = current.offsetParent;
  }
  if (document.compatMode == "BackCompat") {
    var elementScrollTop = document.body.scrollTop;
  } else {
    var elementScrollTop = document.documentElement.scrollTop;
  }
  var right = actualTop - elementScrollTop;
  return {
    x: left,
    y: right,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}
