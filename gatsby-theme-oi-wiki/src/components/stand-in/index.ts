import Img from './Img'
import Pre from './Pre'
import Code from './Code'
import Blockquote from './Blockquote'
import Table from './Table'
import List from './List'
import CodeBlock from './Codeblock'
import { ComponentLike } from 'rehype-react'
import { FC } from 'react'
import Link from './Link'
import Details from './Details'
import Summary from './Summary'

interface GetComponentsArg {
  pathname: string;
  isIndex: boolean;
}

type Components = Record<string, ComponentLike<ReturnType<FC>>>

const getComponents = (arg: GetComponentsArg): Components => ({
  img: Img,
  pre: Pre,
  code: Code,
  codeblock: CodeBlock,
  blockquote: Blockquote,
  a: Link({
    pathname: arg.pathname,
    isIndex: arg.isIndex,
  }),
  details: Details,
  summary: Summary,
  ...Table,
  ...List,
}) as unknown as Components

export default getComponents
