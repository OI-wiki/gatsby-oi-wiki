import React from 'react'
import { StrIndexObj } from '../types/common'

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

/**
 * convert camel case to kebab case
 *
 * example:
 * - colorProfile -> color-profile
 */
function camelCase2KebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}

/**
 * convert kebab and colon to camel case
 *
 * example:
 * - color-profile -> colorProfile
 * - xlink:role -> xlinkRole
 */
function kebabColon2CamelCase(str: string): string {
  return str.replace(/([-:])(.)/g, (_match, _symbol, char) => {
    return char.toUpperCase()
  })
}

type StyleObj = StrIndexObj<string | number>

export function convertStyle(styleStr: string): StyleObj {
  function convertValue(value: string): number | string {
    // value can be converted to pixel automatically by converting it to number
    if (/^\d+$/.test(value)) {
      return Number(value)
    } else {
      return value.replace(/'/g, '"')
    }
  }

  function convertProperty(prop: string): string {
    if (/^-ms-/.test(prop)) {
      prop = prop.substring(1)
    }
    return kebabColon2CamelCase(prop)
  }

  const style: StyleObj = {}

  styleStr
    .split(';')
    .filter(style => style.trim() !== '')
    .forEach(declaration => {
      const rules = declaration.split(':')
      if (rules.length > 1) {
        const prop = convertProperty(rules[0].trim())
        // To handle url: attribute on style
        style[prop] = convertValue(rules.slice(1).join(':').trim())
      }
    })

  return style
}

type Attrs =
  StrIndexObj<boolean>
  | StyleObj
  | StrIndexObj<StyleObj>
  | StrIndexObj & { dangerouslySetInnerHTML: StrIndexObj }

function mapAttribute(tagName: string, attrs: Attrs | StrIndexObj<string[]> = {}, preserveAttributes: Array<string | RegExp>): Attrs {
  // Allow preserving non-standard attribute, e.g: `ng-if`
  const isPreserved = function (att: string): boolean {
    return preserveAttributes.filter(at => at instanceof RegExp ? at.test(att) : at === att).length > 0
  }

  return Object.keys(attrs).reduce((result, attr) => {
    // ignore inline event attribute
    if (!/^on.*/.test(attr)) {
      let attributeName = attr

      if (!isPreserved(attr)) {
        // Convert attribute to camelCase except data-* and aria-* attribute
        // https://facebook.github.io/react/docs/dom-elements.html
        if (!/^(data|aria)-/.test(attr)) {
          attributeName = kebabColon2CamelCase(attr)
        }
        // Convert camelCase data and aria attribute to kebab case
        if (/^(data|aria)[A-Z]/.test(attr)) {
          attributeName = camelCase2KebabCase(attr)
        }
      }

      const name = attributeMap[attributeName as keyof typeof attributeMap] || attributeName
      if (name === 'style') {
        // if there's an attribute called style, this means that the value must be exists
        // even if it's an empty string
        result[name] = convertStyle(attrs.style as string)
      } else if (name === 'className') {
        // React treats MathJAX elements as HTML custom tags
        // Thus its className will keep as is in the final DOM.
        // Rename it to `class` here
        const attrName = tagName.startsWith('mjx-') ? 'class' : 'className'
        result[attrName] = (attrs.className as string[]).join(' ')
      } else {
        // Convert attribute value to boolean attribute if needed
        // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
        const value = attrs[attr]
        const isBooleanAttribute = value === '' || String(value).toLowerCase() === attributeName.toLowerCase()
        result[name] = isBooleanAttribute ? 'true' : value as string | number
      }
    }

    return result
  }, {} as Attrs)
}

export type ReactiveHastComponents = StrIndexObj<React.FC<any>>;
export type ReactiveHastHtmlAst = {
  tagName: string;
  type: string;
  value: ReturnType<typeof React.createElement> | string;
  properties: Attrs;
  children?: (Omit<ReactiveHastHtmlAst, 'value'> & { value: string })[]
}

const dangerouslySetChildren = ['style']

function reactiveHast(ast: ReactiveHastHtmlAst, components: ReactiveHastComponents, index = 1, needKey = false): ReactiveHastHtmlAst['value'] {
  if (ast.type === 'text') {
    return ast.value
  } else if (ast.type === 'comment') {
    return React.createElement(React.Fragment, null)
  } else {
    const props = mapAttribute(ast.tagName, ast.properties, [])
    const tag = components[ast.tagName] ?? ast.tagName

    if (dangerouslySetChildren.indexOf(ast.tagName) > -1) {
      const childNode = ast.children?.[0];
      (props as any).dangerouslySetInnerHTML = {
        __html: childNode?.value.trim(),
      }
      return React.createElement(tag, props, null)
    } else {
      if (needKey && !props['key']) props['key'] = `${ast.tagName}-${index.toString()}`
      const children = ast.children?.map((el, i) => reactiveHast(el, components, i, true))
      return React.createElement(tag, props, ...children?.length ? [children] : [])
    }
  }
}

export default reactiveHast
