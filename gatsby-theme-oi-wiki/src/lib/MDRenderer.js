import reactiveHast from './reactive-hast'

export default function MDRenderer ({ components, htmlAst }) {
  const comps = components ?? {}
  return reactiveHast({ ...htmlAst, tagName: 'div' }, comps)
}
