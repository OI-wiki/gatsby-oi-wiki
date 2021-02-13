import usePersistedState from 'use-persisted-state'

export interface Settings {
  darkMode: DarkModeSettings;
  animation: AnimationSettings;
  theme: ThemeSettings;
}

interface DarkModeSettings {
  type: 'user-preference' | 'always-on' | 'always-off';
  brightness: number;
}

interface AnimationSettings {
  smoothScroll: boolean,
}

interface ThemeSettings {
  navColor: string;
}

const defaultSettings: Settings = {
  darkMode: {
    type: 'user-preference',
    brightness: 0.7,
  },
  animation: {
    smoothScroll: true,
  },
  theme: {
    navColor: 'auto',
  },
}

// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export const useSetting = (): [Settings, (s: RecursivePartial<Settings>) => void] => {
  const [settings, setSettings] = usePersistedState('settings')(defaultSettings)

  const updateSetting = (newSettings: RecursivePartial<Settings>): void => {
    const finalSettings = {...defaultSettings, ...settings, ...newSettings}
    setSettings(finalSettings)
    // eslint-disable-next-line dot-notation
    window !== undefined && window['onthemechange'](finalSettings)
  }
  return [settings, updateSetting];
}