'use strict'

window.onthemechange = function (settings) {
  const fallback = localStorage.settings &&
    JSON.parse(localStorage.settings).darkMode.type
  const darkOpt = settings !== undefined ? settings.darkMode.type : fallback
  let themeClass = 'themeAuto'
  if (darkOpt === undefined || darkOpt === 'user-preference') {
    // themeClass = 'themeAuto'
  } else {
    themeClass = darkOpt === 'always-on' ? 'themeDark' : 'themeLight'
  }
  const docEl = document.querySelector('html')
  docEl.classList.remove('themeLight', 'themeDark', 'themeAuto')
  docEl.classList.add(themeClass)
}

window.onthemechange()

// this file should be MANUALLY inserted into html.js
