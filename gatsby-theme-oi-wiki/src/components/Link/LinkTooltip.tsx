import React, { useState } from 'react'
import ToolCard from './ToolCard'
import { useDidUpdateEffect } from './hooks'
import { Nullable } from '../../types/common'

export interface PreviewData {
  text: string,
  title: string,
}

export interface LinkTooltipProps {
  /** api url */
  url: string,
  /** link */
  to: string,
}

export type FetchStatus = 'error' | 'fetching' | 'fetched' | 'not_fetched'

async function getExcerpt(url: string): Promise<PreviewData> {
  return await fetch(url).then(res => res.json())
}

const LinkTooltip: React.FC<LinkTooltipProps> = (props) => {
  const { url, children } = props
  const [content, setContent] = useState<Nullable<PreviewData>>(null)
  const [status, setStatus] = useState<FetchStatus>('not_fetched')
  const [open, setOpen] = useState<boolean>()

  useDidUpdateEffect(() => {
    if (status === 'not_fetched') {
      // 防止重复获取
      setStatus('fetching')
      getExcerpt(url).then(data => {
        setContent(data)
        setStatus('fetched')
      }).catch(e => {
        console.error(e)
        setStatus('error')
      })
    }
  }, [open])

  return <ToolCard
    onHover={() => {
      setOpen(true)
    }}
    content={content}
    to={props.to}
    status={status}
    closeDelay={200}
    openDelay={500}
  >
    {children}
  </ToolCard>
}

export default LinkTooltip
