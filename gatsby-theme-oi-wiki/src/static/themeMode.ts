const themeMode = (): void => {
  const STORE_KEY = 'theme'
  const THEME_MODE = {
    light: 'light',
    dark: 'dark',
  }

  const setTheme = (theme: string): void => {
    document.documentElement.dataset[STORE_KEY] = theme
    window.__theme = theme
    window.__onThemeChange(theme)
  }

  /**
   * can be overwritten in FC
   */
  window.__onThemeChange = () => {
    // do sth
  }

  /**
   * can be triggered by FC
   * @param theme
   */
  window.__setPreferredTheme = (theme) => {
    setTheme(theme)
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(window.__theme))
    } catch (e) {
      // just ignore
    }
  }

  const matchTheme = (query: MediaQueryList | MediaQueryListEvent): string => {
    return query.matches ? THEME_MODE.dark : THEME_MODE.light
  }

  const darkQuery = window.matchMedia(`(prefers-color-scheme: ${THEME_MODE.dark})`)

  darkQuery.addEventListener('change', (event) => {
    window.__setPreferredTheme(matchTheme(event))
  })

  try {
    setTheme(JSON.parse(localStorage.getItem(STORE_KEY) || '') || matchTheme(darkQuery))
  } catch (e) {
    // just ignore
  }
}

export default themeMode
