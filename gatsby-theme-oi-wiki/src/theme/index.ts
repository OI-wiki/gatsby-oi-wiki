import createPalette, { Palette, PaletteColor } from '@material-ui/core/styles/createPalette'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'
import { createTheme, hexToRgb, ThemeOptions, withStyles } from '@material-ui/core/styles'

import globalStyles from './global'

import paletteColors from '../styles/colors'
import { Nullable, StrIndexObj } from '../types/common'
import { noopNull } from '../utils/common'

type DStrIndexObj = StrIndexObj<StrIndexObj>
type HexToRGBAParamType = (color?: string, alpha?: number) => string | null
type ApplyDefaultsType = (theme: Palette, ...keys: (keyof Palette)[]) => StrIndexObj<Nullable<string>>
type ApplyAdaptiveType = (...keys: (keyof Palette)[]) => DStrIndexObj
type WithStylesReturnType = ReturnType<typeof withStyles>
type GetThemeCSSElType = (style: WithStylesReturnType) => ReturnType<WithStylesReturnType>

const RGBA_EXPR = /^rgba\((.*)\)$/
const RGB_EXPR = /^rgb\((.*)\)$/
const HEX_EXPR = /^#([A-Fa-f0-9]{3}){1,2}$/
const hexToRGBAParam: HexToRGBAParamType = (color, alpha = 1) => {
  if (color) {
    let res
    if (color === 'auto') return color
    else if ((res = color.match(RGBA_EXPR)) !== null) {
      return res[1]
    } else if ((res = color.match(RGB_EXPR)) !== null) {
      return `${res[1]}, ${alpha}`
    } else if (HEX_EXPR.test(color)) {
      return `${hexToRgb(color).trim().match(RGB_EXPR)?.[1]}, ${alpha}`
    } else throw new Error('Bad Hex ' + color)
  } else return null
}

const applyDefaults: ApplyDefaultsType = (theme, ...keys) => {
  const exp = /^(#|rgba)/
  const keyObj: ReturnType<ApplyDefaultsType> = {}
  keys.forEach(k => {
    const colorKind = theme[k as keyof Palette]
    Object.keys(colorKind).forEach(el => {
      const hex = (colorKind as PaletteColor)[el as keyof PaletteColor]
      if (exp.test(hex)) {
        keyObj[`--${k}-${el}`] = hexToRGBAParam(hex.toString())
      }
    })
  })

  return keyObj
}

const applyAdaptive: ApplyAdaptiveType = (...keys) => {
  const exp = /^(#|rgba)/
  const rst: ReturnType<ApplyAdaptiveType> = {}
  keys.forEach(k => {
    const obj: StrIndexObj = {}
    const colorKind = lightColor[k]
    Object.keys(colorKind).forEach(el => {
      const color = (colorKind as PaletteColor)[el as keyof PaletteColor]
      obj[el] = exp.test(color) ? `rgba(var(--${k}-${el}))` : color
    })
    rst[k] = obj
  })

  return rst
}

const getThemeCssEl: GetThemeCSSElType = (style) => style(noopNull)

// FIXME: 修起来比较麻烦，不得已用 any
export const CustomCssBaseline = globalStyles(noopNull as any)

const lightColor = createPalette({ type: 'light' })
const darkColor = createPalette({ type: 'dark' })
const paletteKeys: (keyof Palette)[] = ['primary', 'secondary', 'text', 'background', 'action', 'error', 'warning', 'info', 'success']

const lightCss = {
  '@global': {
    'html[data-theme=light]': {
      '--primary-color': hexToRGBAParam(lightColor.primary.main),
      '--footer-bg': hexToRGBAParam(grey[200]),
      '--footer-text': hexToRGBAParam(grey[700]),
      '--details-border': hexToRGBAParam(blue[500]),
      '--details-main': hexToRGBAParam(blue[50]),
      '--blockquote': '0, 0, 0, .12',
      '--inline-color': '#37474f',
      '--inline-bg-hsla': 'hsla(0,0%,85%,.5)',
      '--search-bg': hexToRGBAParam(grey[100]),
      // '--search-highlight': hexToRGBAParam('#174d8c'),
      '--tab-hover': hexToRGBAParam('#000'),
      '--divider': hexToRGBAParam(lightColor.divider),
      '--subtitle-text': '0, 0, 0, .7',
      '--alert-info-bg': hexToRGBAParam(blue[50]),
      '--alert-error-bg': hexToRGBAParam(red[50]),
      '--clicked-reaction-button': hexToRGBAParam('#faebd7'),
      '--fade-background': 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)',
      '--link-default': hexToRGBAParam('#576ad4'),
      '--link-hover': hexToRGBAParam('#03a9f4'),
      '--highlight-filter': '',
      '--inline-code-color': hexToRGBAParam('#37474f'),
      '--inline-code-background': '236, 236, 236, .5',
      ...applyDefaults(lightColor, ...paletteKeys),
    },
  },
}

const darkCss = {
  '@global': {
    'html[data-theme=dark]': {
      '--primary-color': hexToRGBAParam(darkColor.primary.main),
      '--paper-color': hexToRGBAParam(darkColor.background.paper),
      '--bg-color': hexToRGBAParam(darkColor.background.default),
      '--footer-bg': hexToRGBAParam(grey[900]),
      '--footer-text': hexToRGBAParam(grey[300]),
      '--details-border': hexToRGBAParam(blue[500]),
      '--details-main': hexToRGBAParam(grey[700]),
      '--blockquote': '255, 255, 255, .12',
      '--search-bg': hexToRGBAParam(grey[700]),
      // '--search-highlight': hexToRGBAParam('#acccf1'),
      '--tab-hover': hexToRGBAParam('#fff'),
      '--divider': hexToRGBAParam(darkColor.divider),
      '--subtitle-text': '255, 255, 255. .7',
      '--alert-info-bg': hexToRGBAParam(grey[900]),
      '--alert-error-bg': hexToRGBAParam(grey[900]),
      '--clicked-reaction-button': hexToRGBAParam('#202020'),
      '--fade-background': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(66, 66, 66, 1) 50%)',
      '--link-default': hexToRGBAParam('#20baff'),
      '--link-hover': hexToRGBAParam('#52ebff'),
      '--highlight-filter': 'invert(98%) hue-rotate(180deg)',
      '--inline-code-color': hexToRGBAParam('#c4c4c4'),
      '--inline-code-background': hexToRGBAParam('#424242'),
      ...applyDefaults(darkColor, ...paletteKeys),
    },
  },
}

const LightCssBaseline = getThemeCssEl(withStyles(() => lightCss))
const DarkCssBaseline = getThemeCssEl(withStyles(() => darkCss))
const AutoCssBaseline = getThemeCssEl(withStyles(() => ({
  '@global': {
    'html[data-theme=auto]': lightCss['@global']['html[data-theme=light]'],
    '@media (prefers-color-scheme: dark)': {
      'html[data-theme=auto]': darkCss['@global']['html[data-theme=dark]'],
    },
  },
})))

const SecondaryColorCssBaseline = getThemeCssEl(withStyles(() =>
  paletteColors.reduce((obj, c) => {
    if (c.id !== '0') {
      obj['@global'][`html[data-secondary-color='${c.id}']`] = {
        '--secondary-light': hexToRGBAParam(c.light),
        '--secondary-dark': hexToRGBAParam(c.dark),
        '--secondary-main': hexToRGBAParam(c.main),
        '--secondary-contrast-text': hexToRGBAParam(c.contrastText),
      }
    }
    return obj
  }, { '@global': {} as StrIndexObj<any> })))

const adaptiveTheme = createTheme({
  palette: {
    primary: {
      main: 'rgba(var(--primary-color))',
    },
    ...applyAdaptive(...paletteKeys),
    secondary: {
      light: 'rgba(var(--secondary-light))',
      dark: 'rgba(var(--secondary-dark))',
      main: 'rgba(var(--secondary-main))',
      contrastText: 'rgba(var(--secondary-contrast-text))',
    },
    footer: {
      background: 'rgba(var(--footer-bg))',
      text: 'rgba(var(--footer-text))',
    },
    details: {
      border: 'rgba(var(--details-border))',
      main: 'rgba(var(--details-main))',
    },
    blockquote: 'rgba(var(--blockquote))',
    search: {
      messageBackground: 'rgba(var(--search-bg))',
      // highlight: 'rgba(var(--search-highlight))',
    },
    tab: {
      colorOnHover: 'rgba(var(--tab-hover))',
    },
    divider: 'rgba(var(--divider))',
    // getContrastText (color) {
    //   if (color.startsWith('rgba(v')) return 'rgba(var(--text-primary))'
    //   else return lightColor.getContrastText(color)
    // },
    subTitle: 'rgba(var(--subtitle-text))',
    reactionButtonBackground: 'rgba(var(--clicked-reaction-button))',
    fadeTextBackground: 'var(--fade-background)',
    // link: {
    //   default: 'rgba(var(--link-default))',
    //   hover: 'rgba(var(--link-hover))',
    // },
  },
  // Material-UI hard-coded and/or used color manipulator in several components
  // override them here as a workaround
  overrides: {
    MuiChip: {
      root: {
        color: 'rgba(var(--text-primary))',
      },
      outlined: {
        border: '1px solid rgba(var(--divider))',
      },
    },
    MuiAlert: {
      standardInfo: {
        color: 'rgba(var(--text-primary))',
        backgroundColor: 'rgba(var(--alert-info-bg))',
      },
      standardError: {
        color: 'rgba(var(--text-primary))',
        backgroundColor: 'rgba(var(--alert-error-bg))',
      },
    },
    MuiIconButton: {
      root: {
        transition: `background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color ${250}ms ease-in-out`,
      },
    },
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
  },
} as ThemeOptions)

export { adaptiveTheme, LightCssBaseline, DarkCssBaseline, AutoCssBaseline, SecondaryColorCssBaseline }
