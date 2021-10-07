import createCSSVars, { computeCss, VarMap } from '../utils/createCssVarPalette'
import { theme } from '../theme'
import persistStore from '../utils/persistStore'
import { SerializedStyles } from '@emotion/react'
import { Nullable } from '../types/common'
import { computed, observable } from 'mobx'
import { ThemeMode } from '../types/ThemeMode'

export interface VarsStore {
  light: VarMap;
  dark: VarMap;
  styleEl: Nullable<HTMLElement>;

  computedCss: SerializedStyles;

  setLight(light: VarMap): void;

  setDark(dark: VarMap): void;

  setStyleEl(el: Nullable<HTMLElement>): void;

  setWithKey(label: ThemeMode, key: string, val: string): void;

  getWithKey(label: ThemeMode, key: string): string;
}

const VARS_STORE_ID = 'css-vars'
const { lightMap, darkMap } = createCSSVars(theme.palette)

const cssVarsStore = persistStore<VarsStore>(
  {
    light: lightMap,
    dark: darkMap,
    styleEl: null,

    get computedCss() {
      return computeCss(lightMap, darkMap)
    },

    setLight(light) {
      this.light = light
    },
    setDark(dark) {
      this.dark = dark
    },
    setStyleEl(el) {
      this.styleEl = el
    },
    setWithKey(label, key, val) {
      this[label].set(key, val)
    },
    getWithKey(label, key) {
      const val = this[label].get(key)
      return typeof val === 'undefined'
        ? ''
        : val.includes(',')
          ? `rgba(${val})`
          : val
    },
  },
  {
    name: VARS_STORE_ID,
    properties: ['light', 'dark'],
  },
  {
    decorators: {
      light: observable.deep,
      dark: observable.deep,
      computedCss: computed,
    },
  },
)


export { cssVarsStore, VARS_STORE_ID }
