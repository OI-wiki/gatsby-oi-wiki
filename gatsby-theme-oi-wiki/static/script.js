export default function () {
  'use strict'
  window.onthemechange = function (settings) {
    const fallback = localStorage.settings &&
      JSON.parse(localStorage.settings).darkMode.type
    const darkOpt = settings !== undefined ? settings.darkMode.type : fallback
    let themeClass = 'themeAuto'
    let secondaryColorId = settings && settings.theme && settings.theme.secondary ? settings.theme.secondary : '3'
    if (darkOpt === undefined || darkOpt === 'user-preference') {
      // themeClass = 'themeAuto'
    } else {
      themeClass = darkOpt === 'always-on' ? 'themeDark' : 'themeLight'
    }
    const docEl = document.querySelector('html')

    docEl.className = ""
    // docEl.classList.remove('themeLight', 'themeDark', 'themeAuto')
    docEl.classList.add(themeClass)
    docEl.classList.add('secondaryColor' + secondaryColorId)
  }

  window.onthemechange()
}