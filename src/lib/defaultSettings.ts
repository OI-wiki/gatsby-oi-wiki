// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Settings from '../types/settings'

const defaultSettings: Settings = {
  darkMode: {
    type: 'user-preference',
    brightness: 0.7,
  },
  animation: {
    enable: true,
  },
  theme: {
    navColor: 'auto',
  },
}

export default defaultSettings
