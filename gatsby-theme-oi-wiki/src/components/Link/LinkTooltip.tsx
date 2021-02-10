import React, { useState } from 'react'
import ToolCard from './ToolCard'

type Data = {
  html: string,
  title: string,
}
function contentRender (data: Data) : string {
  return `<p><strong>${data.title}</strong></p>${data.html}`
}
async function getExcerpt (url) : Promise<string> {
  console.log('fetching', url)
  const res = await fetch(url).then(res => res.json())
  return contentRender(res)
}

type Props = {
  url: string,
  children: any,
}

const LinkTooltip : React.FC<Props> = function (props: Props) {
  const { url, children } = props
  const [content, setContent] = useState('获取中……')
  const [status, setStatus] = useState('nofetch')

  const onOpen = () : void => {
    if (status === 'nofetch') {
      setStatus('fetching') // 防止重复获取
      getExcerpt(url).then(data => {
        console.log('data', data)
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
      content={<span style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: content }}></span>}
      closeDelay={500}
    >
      {children}
    </ToolCard>
  )
}

export default LinkTooltip
