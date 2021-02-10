import React, { useState } from 'react'
import ToolCard from './ToolCard'

export interface PreviewData {
  html: string,
  title: string,
}

async function getExcerpt (url) : Promise<PreviewData> {
  console.log('fetching', url)
  const res = await fetch(url).then(res => res.json())
  return res
}

type Props = {
  url: string,
  children: any,
}

const LinkTooltip : React.FC<Props> = function (props: Props) {
  const { url, children } = props
  const [content, setContent] = useState<PreviewData>(null)
  const [status, setStatus] = useState('nofetch')

  const onOpen = () : void => {
    if (status === 'nofetch') {
      setStatus('fetching') // 防止重复获取
      getExcerpt(url).then(data => {
        setContent(data)
        setStatus('hasdata')
      }).catch(e => {
        console.error(e)
        setStatus('nofetch') // 获取失败
      })
    }
  }

  return (
    <ToolCard
      onOpen={onOpen}
      content={content}
      closeDelay={500}
    >
      {children}
    </ToolCard>
  )
}

export default LinkTooltip
