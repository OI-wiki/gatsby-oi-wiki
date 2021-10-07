import { ThemeMode } from '../types/ThemeMode'

const useThemeMode = (): ThemeMode => {
  return document.documentElement.dataset.theme as ThemeMode
}

export default useThemeMode
