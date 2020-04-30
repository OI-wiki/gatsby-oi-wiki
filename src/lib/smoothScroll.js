/**
 * 获取动画进行 progress 时，物体的位移
 * 该动画曲线是阻尼振动模型。
 * @param progress - 动画的播放进度，[0, 1] 之间的实数
 * @returns - 返回物体的位移百分比，[0, 1] 之间的实数
 * */
function getDisplacement (progress) {
  const t = progress
  if (t < 0) { return 0 }
  // FIXME: 可能是由于曲线的设计问题，在 t=1 的时候没法达到目的位置
  return 0.0454545 * Math.exp(-701.297338 * t) *
    (0.18034 - 22.1803 * Math.exp(695.59609 * t) +
      22 * Math.exp(701.297338 * t))
}

/**
 *
 * @param yCoordinate
 * @param duration 移动动画的持续时间，用毫秒表示
 */
function smoothScrollTo (yCoordinate, duration = 1000) {
  const offset = yCoordinate - document.documentElement.scrollTop
  const startTime = performance.now()
  let totalDisplacement = 0
  const performAnimation = (time) => {
    if (time - startTime > duration) {
      return
    }
    const displacement = getDisplacement((time - startTime) / duration)
    const delta = (displacement - totalDisplacement) * offset
    totalDisplacement = displacement
    window.scrollBy(0, delta)
    requestAnimationFrame(performAnimation)
  }
  requestAnimationFrame(performAnimation)
}

export default smoothScrollTo
