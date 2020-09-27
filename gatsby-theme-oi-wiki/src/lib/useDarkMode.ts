import createPersistedState from 'use-persisted-state'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import defaultSettings from './defaultSettings'

const useConfig = createPersistedState('settings')

export default function useDarkMode (): boolean {
  const [setting] = useConfig(defaultSettings)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true })
  // noSsr: when it is false(by default), preact is enabled and user prefers dark mode,
  // useMediaQuery will return twice. Firstly false, then true. That leads to flicker whenever the route changes.
  // According to the documentation https://material-ui.com/zh/components/use-media-query/#usemediaquery-query-options-matches
  // , it should be false if you are using server side rendering.
  // However, I found that ssr still works well even if i set it to true. Therefore I enable noSsr as a workaround.
  let enableDark: boolean
  if (setting.darkMode.type === 'always-on') {
    enableDark = true
  } else if (setting.darkMode.type === 'always-off') {
    enableDark = false
  } else if (setting.darkMode.type === 'user-preference') {
    enableDark = prefersDarkMode
  } else {
    enableDark = prefersDarkMode // TODO: to be implemented
  }
  return enableDark
}
