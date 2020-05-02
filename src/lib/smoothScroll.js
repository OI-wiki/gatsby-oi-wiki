/**
 * 获取动画进行 progress 时，物体的位移
 * 该动画曲线是阻尼振动模型。弹簧的劲度系数是 500，阻力系数是 100，物体质量为 3
 * @param progress - 动画的播放进度，[0, 1] 之间的实数
 * @returns - 返回物体的位移百分比，[0, 1] 之间的实数
 * 动画曲线的方程为 f(t) = 1.00283 * (
 * \frac{1}{4} \, {\left(\sqrt{10} - 2\right)} e^{\left(-\frac{10}{3} \, x {\left(\sqrt{10} + 5\right)}\right)} -
 * \frac{1}{4} \, {\left(\sqrt{10} + 2\right)} e^{\left(\frac{10}{3} \, x {\left(\sqrt{10} - 5\right)}\right)} + 1
 * )
 * */
function getDisplacement (progress) {
  if (progress < 0) {
    return 0
  }
  const f = (t) => 1 + 0.25 * (
    1.1622776601683795 * Math.exp((-10 / 3) * t * 8.16227766016838) -
    5.16227766016838 * Math.exp((10 / 3) * t * -1.8377223398316205)
  )
  return f(progress) * 1.00283
}

/**
 *
 * @param yCoordinate
 * @param duration 移动动画的持续时间，用毫秒表示
 */
function smoothScrollTo (yCoordinate, duration = 1000) {
  const offset = yCoordinate - window.scrollY
  const startTime = performance.now()
  const startPosition = window.scrollY
  const performAnimation = (time) => {
    if (time - startTime > duration) {
      return
    }
    const displacement = offset * getDisplacement((time - startTime) / duration)
    window.scrollTo(0, startPosition + displacement)
    requestAnimationFrame(performAnimation)
  }
  requestAnimationFrame(performAnimation)
}

export default smoothScrollTo
