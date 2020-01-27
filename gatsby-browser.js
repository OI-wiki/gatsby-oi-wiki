export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This tutorial has been updated. ` +
      `Reload to display the latest version?`
  )
  if (answer === true) {
    window.location.reload()
  }
  if (window.MathJax !== undefined) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }
}