import React from 'react'

// modified on https://github.com/pveyes/htmr

const attributeMap = {
  for: 'htmlFor',
  class: 'className',
  acceptcharset: 'acceptCharset',
  accesskey: 'accessKey',
  allowfullscreen: 'allowFullScreen',
  allowtransparency: 'allowTransparency',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  charset: 'charSet',
  classid: 'classID',
  classname: 'className',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  enctype: 'encType',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  inputmode: 'inputMode',
  keyparams: 'keyParams',
  keytype: 'keyType',
  marginheight: 'marginHeight',
  marginwidth: 'marginWidth',
  maxlength: 'maxLength',
  mediagroup: 'mediaGroup',
  minlength: 'minLength',
  novalidate: 'noValidate',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  rowspan: 'rowSpan',
  spellcheck: 'spellCheck',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  usemap: 'useMap',
  viewbox: 'viewBox',
}

function hypenColonToCamelCase (str) {
  // convert hypen and colon to camel case
  // color-profile -> colorProfile
  // xlink:role -> xlinkRole
  return str.replace(/(-|:)(.)/g, (match, symbol, char) => {
    return char.toUpperCase()
  })
}

export function convertStyle (styleStr) {
  function convertValue (value) {
    // value can be converted to pixel automatically by converting it to number
    if (/^\d+$/.test(value)) {
      return Number(value)
    }

    return value.replace(/'/g, '"')
  }

  function convertProperty (prop) {
    if (/^-ms-/.test(prop)) {
      // eslint-disable-next-line no-param-reassign
      prop = prop.substr(1)
    }

    return hypenColonToCamelCase(prop)
  }

  const style = {}

  styleStr
    .split(';')
    .filter(style => {
      const declaration = style.trim()
      return declaration !== ''
    })
    .forEach(declaration => {
      const rules = declaration.split(':')
      if (rules.length > 1) {
        const prop = convertProperty(rules[0].trim())
        // To handle url: attribute on style
        const val = convertValue(
          rules
            .slice(1)
            .join(':')
            .trim(),
        )
        style[prop] = val
      }
    })

  return style
}

export function mapAttribute (tagName, attrs = {}, preserveAttributes) {
  return Object.keys(attrs).reduce((result, attr) => {
    // ignore inline event attribute
    if (/^on.*/.test(attr)) {
      return result
    }

    // Convert attribute to camelCase except data-* and aria-* attribute
    // https://facebook.github.io/react/docs/dom-elements.html
    let attributeName = attr
    if (!/^(data|aria)-/.test(attr)) {
      // Allow preserving non-standard attribute, e.g: `ng-if`
      const preserved = preserveAttributes.filter(at => {
        if (at instanceof RegExp) {
          return at.test(attr)
        }

        return at === attr
      })

      if (preserved.length === 0) {
        attributeName = hypenColonToCamelCase(attr)
      }
    }

    const name = attributeMap[attributeName] || attributeName
    if (name === 'style') {
      // if there's an attribute called style, this means that the value must be exists
      // even if it's an empty string
      result[name] = convertStyle(attrs.style)
    } else if (name === 'className') {
      // React treats MathJAX elements as HTML custom tags
      // Thus its className will keep as is in the final DOM.
      // Rename it to `class` here
      const attrName = tagName.startsWith('mjx-') ? 'class' : 'className'
      result[attrName] = attrs.className.join(' ')
    } else {
      const value = attrs[attr]
      // Convert attribute value to boolean attribute if needed
      // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
      const isBooleanAttribute = value === '' || String(value).toLowerCase() === attributeName.toLowerCase()
      result[name] = isBooleanAttribute ? true : value
    }

    return result
  }, {})
}

const dangerouslySetChildren = ['style']

export default function reactiveHast (ast, components, index = 1) {
  if (ast.type === 'text') {
    // const val = ast.value.replace(/\\/g,"");
    return ast.value
  }

  if (ast.type === 'comment') {
    return <></>
  }

  const props = { key: index.toString(), ...mapAttribute(ast.tagName, ast.properties, []) }

  const tag = components[ast.tagName] ?? ast.tagName

  if (dangerouslySetChildren.indexOf(ast.tagName) > -1) {
    const childNode = ast.children[0]
    props.dangerouslySetInnerHTML = {
      __html: childNode.value.trim(),
    }
    return React.createElement(tag, props, null)
  }

  const children = ast.children.map((el, i) => reactiveHast(el, components, i))

  return React.createElement(tag, props, ...children.length ? [children] : [])
}
