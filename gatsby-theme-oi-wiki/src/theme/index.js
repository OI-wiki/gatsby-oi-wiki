import createPalette from '@material-ui/core/styles/createPalette'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'
import { createMuiTheme, withStyles, hexToRgb } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import globalStyles from './global'

import paletteColors from '../styles/colors'

function CustomCssEl () {
  return null
}

CustomCssEl.propTypes = { classes: PropTypes.object.isRequired }
export const CustomCssBaseline = globalStyles(CustomCssEl)

const lightColor = createPalette({ type: 'light' })
const darkColor = createPalette({ type: 'dark' })
const paletteKeys = [
  'primary', 'secondary', 'text', 'background', 'action',
  'error', 'warning', 'info', 'success']

function applyDefaults (theme, ...keys) {
  const k = {}
  function applyDefault (key) {
    for (const el of Object.keys(theme[key])) {
      if (/^(#|rgba)/.test(`${theme[key][el]}`)) {
        k[`--${key}-${el}`] = hexToRgbaParam(theme[key][el].toString())
      }
    }
  }
  keys.forEach(applyDefault)
  return k
}

function hexToRgbaParam (color, alpha = 1) {
  if (color === 'auto') return color
  if (/^rgba\(.*\)$/.test(color)) return color.match(/^rgba\((.*)\)$/)[1]
  if (/^rgb\(.*\)$/.test(color)) return color.match(/^rgb\((.*)\)$/)[1] + `, ${alpha}`
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) return hexToRgb(color).trim().match(/^rgb\((.*)\)$/)[1] + `, ${alpha}`
  throw new Error('Bad Hex ' + color)
}

const lightCss = {
  '@global': {
    'html[data-theme=light]': {
      '--primary-color': hexToRgbaParam(lightColor.primary.main),
      '--footer-bg': hexToRgbaParam(grey[200]),
      '--footer-text': hexToRgbaParam(grey[700]),
      '--details-border': hexToRgbaParam(blue[500]),
      '--details-main': hexToRgbaParam(blue[50]),
      '--blockquote': '0, 0, 0, .12',
      '--inline-color': '#37474f',
      '--inline-bg-hsla': 'hsla(0,0%,85%,.5)',
      '--search-bg': hexToRgbaParam(grey[100]),
      // '--search-highlight': hexToRgbaParam('#174d8c'),
      '--tab-hover': hexToRgbaParam('#000'),
      '--divider': hexToRgbaParam(lightColor.divider),
      '--subtitle-text': '0, 0, 0, .7',
      '--alert-info-bg': hexToRgbaParam(blue[50]),
      '--alert-error-bg': hexToRgbaParam(red[50]),
      '--clicked-reaction-button': hexToRgbaParam('#faebd7'),
      '--fade-background': 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)',
      '--link-default': hexToRgbaParam('#576ad4'),
      '--link-hover': hexToRgbaParam('#03a9f4'),
      '--highlight-filter': '',
      '--inline-code-color': hexToRgbaParam('#37474f'),
      '--inline-code-background': '236, 236, 236, .5',
      ...applyDefaults(lightColor, ...paletteKeys),
    },
  },
}

const darkCss = {
  '@global': {
    'html[data-theme=dark]': {
      '--primary-color': hexToRgbaParam(darkColor.primary.main),
      '--paper-color': hexToRgbaParam(darkColor.background.paper),
      '--bg-color': hexToRgbaParam(darkColor.background.default),
      '--footer-bg': hexToRgbaParam(grey[900]),
      '--footer-text': hexToRgbaParam(grey[300]),
      '--details-border': hexToRgbaParam(blue[500]),
      '--details-main': hexToRgbaParam(grey[700]),
      '--blockquote': '255, 255, 255, .12',
      '--search-bg': hexToRgbaParam(grey[700]),
      // '--search-highlight': hexToRgbaParam('#acccf1'),
      '--tab-hover': hexToRgbaParam('#fff'),
      '--divider': hexToRgbaParam(darkColor.divider),
      '--subtitle-text': '255, 255, 255. .7',
      '--alert-info-bg': hexToRgbaParam(grey[900]),
      '--alert-error-bg': hexToRgbaParam(grey[900]),
      '--clicked-reaction-button': hexToRgbaParam('#202020'),
      '--fade-background': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(66, 66, 66, 1) 50%)',
      '--link-default': hexToRgbaParam('#20baff'),
      '--link-hover': hexToRgbaParam('#52ebff'),
      '--highlight-filter': 'invert(98%) hue-rotate(180deg)',
      '--inline-code-color': hexToRgbaParam('#c4c4c4'),
      '--inline-code-background': hexToRgbaParam('#424242'),
      ...applyDefaults(darkColor, ...paletteKeys),
    },
  },
}

function getThemeCssEl (style) {
  function ThemeCssEl () {
    return null
  }
  ThemeCssEl.propTypes = { classes: PropTypes.object.isRequired }
  return style(ThemeCssEl)
}

export const LightCssBaseline = getThemeCssEl(withStyles(() => lightCss))
export const DarkCssBaseline = getThemeCssEl(withStyles(() => darkCss))
export const AutoCssBaseline = getThemeCssEl(withStyles(() => {
  // console.log('lightCss', lightCss)
  return {
    '@global': {
      'html[data-theme=auto]': lightCss['@global']['html[data-theme=light]'],
      '@media (prefers-color-scheme: dark)': {
        'html[data-theme=auto]': darkCss['@global']['html[data-theme=dark]'],
      },
    },
  }
}))

export const SecondaryColorCssBaseline = getThemeCssEl(withStyles(() => {
  return paletteColors.reduce((obj, c) => {
    if (c.id === '0') return obj // auto
    obj['@global'][`html[data-secondary-color='${c.id}']`] = {
      '--secondary-light': hexToRgbaParam(c.light),
      '--secondary-dark': hexToRgbaParam(c.dark),
      '--secondary-main': hexToRgbaParam(c.main),
      '--secondary-contrast-text': hexToRgbaParam(c.contrastText),
    }
    return obj
  }, { '@global': {} })
}))

function applyAdaptives (...keys) {
  const rst = {}
  function applyAdaptive (key) {
    const k = {}
    for (const el of Object.keys(lightColor[key])) {
      k[el] = /^(#|rgba)/.test(`${lightColor[key][el]}`)
        ? `rgba(var(--${key}-${el}))`
        : lightColor[key][el]
    }
    rst[key] = k
  }
  keys.forEach(applyAdaptive)
  return rst
}

const adaptiveTheme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgba(var(--primary-color))',
    },
    ...applyAdaptives(...paletteKeys),
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
})

export { adaptiveTheme }
