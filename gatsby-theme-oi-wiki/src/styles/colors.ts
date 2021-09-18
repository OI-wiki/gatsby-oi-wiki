import {
  lighten,
  darken,
  getContrastRatio,
  SimplePaletteColorOptions,
} from '@material-ui/core/styles'

function addLightOrDark (obj, typ: string, tonalOffset): SimplePaletteColorOptions {
  const tonalOffsetLight = tonalOffset.light || tonalOffset
  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5

  if (obj[typ]) return

  if (typ === 'light') {
    obj.light = lighten(obj.main, tonalOffsetLight)
  } else if (typ === 'dark') {
    obj.dark = darken(obj.main, tonalOffsetDark)
  }
}

// Use the same logic as
// Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
// and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
function getContrastText (background, contrastThreshold) : string {
  const contrastText = getContrastRatio(background, '#fff') >= contrastThreshold
    ? '#fff'
    : 'rgba(0, 0, 0, 0.87)'

  return contrastText
}

function createPaletteColor (color: string, tonalOffset: number): SimplePaletteColorOptions {
  const contrastThreshold = 3
  const obj: SimplePaletteColorOptions = {
    main: color,
  }
  if (color === 'auto') {
    obj.light = 'auto'
    obj.dark = 'auto'
    obj.contrastText = 'auto'
    return obj
  }
  addLightOrDark(obj, 'light', tonalOffset)
  addLightOrDark(obj, 'dark', tonalOffset)
  obj.contrastText = getContrastText(obj.main, contrastThreshold)
  return obj
}

const colors: Array<{desc: string, color: string}> = [
  { color: 'auto', desc: 'auto' },
  { color: '#FFF', desc: 'classical white' },
  { color: '#A00', desc: 'Lily Red' },
  { color: '#e91e63', desc: 'Margatroid Magenta' },
  { color: '#222', desc: 'Breathy Darkness' },
  { color: '#ef5350', desc: 'Red' },
  { color: '#ab47bc', desc: 'Purple' },
  { color: '#7e57c2', desc: 'Deep Purple' },
  { color: '#3f51b5', desc: 'Indigo' },
  { color: '#2196f3', desc: 'Blue' },
  { color: '#03a9f4', desc: 'Light Blue' },
  { color: '#00bcd4', desc: 'Cyan' },
  { color: '#009688', desc: 'Teal' },
  { color: '#4caf50', desc: 'Green' },
  { color: '#7cb342', desc: 'Light Green' },
  { color: '#c0ca33', desc: 'Lime' },
  { color: '#f9a825', desc: 'Yellow' },
  { color: '#ffa000', desc: 'Amber' },
  { color: '#fb8c00', desc: 'Orange' },
  { color: '#ff7043', desc: 'Deep Orange' },
  { color: '#795548', desc: 'Brown' },
  { color: '#757575', desc: 'Grey' },
  { color: '#546e7a', desc: 'Blue Grey' },
]

export interface LabeledPaletteColor extends SimplePaletteColorOptions {
  desc: string;
  id: string
}

const paletteColors: Array<LabeledPaletteColor> = colors.map((c, i) => ({
  ...createPaletteColor(c.color, 0.2),
  desc: c.desc,
  id: i.toString(),
}))

export default paletteColors
