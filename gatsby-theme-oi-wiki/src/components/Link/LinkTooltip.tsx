import React, { useState } from 'react'
import ToolCard from './ToolCard'
import { useDidUpdateEffect } from './utils'

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

export type FetchStatus = 'error' | 'fetching' | 'fetched' | 'not_fetched'

const LinkTooltip : React.FC<Props> = function (props: Props) {
  const { url, children } = props
  const [content, setContent] = useState<PreviewData>(null)
  const [status, setStatus] = useState<FetchStatus>('not_fetched')
  const [open, setOpen] = useState<boolean>()
  useDidUpdateEffect(() => {
    if (status === 'not_fetched') {
      setStatus('fetching') // 防止重复获取
      getExcerpt(url).then(data => {
        setContent(data)
        setStatus('fetched')
      }).catch(e => {
        console.error(e)
        setStatus('error') // 获取失败
      })
    }
  }, [open])

  return (
    <ToolCard
      onOpen={() => {
        setOpen(true)
      }}
      content={content}
      status={status}
      closeDelay={300}
    >
      {children}
    </ToolCard>
  )
}

export default LinkTooltip
