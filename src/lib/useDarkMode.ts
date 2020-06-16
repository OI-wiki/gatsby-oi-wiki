import createPersistedState from 'use-persisted-state'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import defaultSettings from './defaultSettings'

const useConfig = createPersistedState('settings')

export default function useDarkMode (): boolean {
  const [setting] = useConfig(defaultSettings)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true })
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
