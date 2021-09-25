import { TocNode } from './TocList'
import { DeepRequiredNonNull, Nullable } from '../../types/common'
import Slug from 'github-slugger'

export type TocItem = DeepRequiredNonNull<Pick<GatsbyTypes.MarkdownHeading, 'id' | 'value' | 'depth'>>


const getIDFromHash = (url: string): string => url.substring(1, url.length)

const tocConverter = (items: TocItem[]): TocNode[] => {
  const minLevel = items.reduce((v, i) => Math.min(v, i.depth), 5)
  const curNode: Nullable<TocNode>[] = Array.from({ length: 6 }, () => null)
  const data: TocNode[] = []
  const REF_EXPR = /ref\d+$/
  let index: number

  const slugs = new Slug()
  slugs.reset()

  items.forEach((item) => {
    const level = item.depth - minLevel
    const title = item.value.replace(/<[^>]*>?/gm, '')
    index = level > 0 ? (curNode[level - 1]?.children.length || 0) : data.length
    const newNode: TocNode = {
      url: `#${slugs.slug(title)}`.replace(REF_EXPR, ''),
      title: title.replace(REF_EXPR, ''),
      level,
      index,
      children: [],
      status: 'collapse',
      element: null,
      parent: null,
      selfElement: null,
    }
    curNode[level] = newNode

    if (level === 0) {
      data.push(newNode)
    } else {
      if (curNode[level - 1]) curNode[level - 1]?.children.push(newNode)
      newNode.parent = curNode[level - 1]
    }
  })
  return data
}

const bindHTMLElement = (toc: TocNode[]): void => {
  toc.forEach((i, idx, arr) => {
    if (i.element === null) arr[idx].element = document.getElementById(getIDFromHash(i.url))
    if (i.selfElement === null) arr[idx].selfElement = document.getElementById(`toc-${i.url}`)
    if (i.children) bindHTMLElement(i.children)
  })
}

const nodeSetActive = (node: Nullable<TocNode>, val: boolean): void => {
  for (let u = node; u !== null; u = u.parent) u.status = val ? 'expanded' : 'collapse'
  if (val && node) node.status = 'active'
}

const getLstChild = (node: Nullable<TocNode>): Nullable<TocNode> => (
  (node && node.children.length > 0)
    ? getLstChild(node.children[node.children.length - 1])
    : node
)

const getPrevItem = (rootList: TocNode[], node: TocNode): Nullable<TocNode> => {
  const parent = node.parent
  const prevIdx = node.index - 1
  return prevIdx >= 0
    ? getLstChild((parent === null ? rootList : parent.children)[prevIdx])
    : parent
}

const getNextItem = (rootList: TocNode[], node: TocNode): Nullable<TocNode> => {
  const parent = node.parent
  const nextIdx = node.index + 1
  if (parent === null) {
    return rootList.length > nextIdx
      ? rootList[nextIdx]
      : null
  } else {
    return parent.children.length > nextIdx
      ? parent.children[nextIdx]
      : getNextItem(rootList, parent)
  }
}

export { getIDFromHash, tocConverter, bindHTMLElement, nodeSetActive, getLstChild, getPrevItem, getNextItem }
