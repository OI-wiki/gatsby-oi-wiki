import usePersistedState from 'use-persisted-state';
import { LabeledPaletteColor } from '../styles/colors';
import merge from 'deepmerge';

export interface Settings {
  darkMode: {
    type: 'user-preference' | 'always-on' | 'always-off';
    brightness: number;
  }
  animation: {
    smoothScroll: boolean;
  }
  theme: {
    /** null: auto */
    primary: LabeledPaletteColor | null;
    /** id */
    secondary: string;
    fallbackMonoFont: boolean
  }
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
    primary: null,
    secondary: '3', // Margatriod Magenta
    fallbackMonoFont: false,
  },
};

// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
// 第一个回答会让 linter unhappy, 所以魔改了一下
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : RecursivePartial<T[P]>
};

export const useSetting = (): [Settings, (s: RecursivePartial<Settings>) => void] => {
  const [settings, setSettings] = usePersistedState('settings')(defaultSettings);

  const updateSetting = (newSettings: RecursivePartial<Settings>): void => {
    const finalSettings = merge.all([defaultSettings, settings, newSettings]) as Settings;
    setSettings(finalSettings);
    window !== undefined && window['onthemechange'](finalSettings);
  };
  return [settings, updateSetting];
};
