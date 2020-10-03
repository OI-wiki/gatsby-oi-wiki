import { useState } from 'react'
import constate from 'constate'

const [InputContentProvider, useInputContentContext] = constate(() => {
  const [inputContent, setInputContent] = useState('')
  return { inputContent, setInputContent }
})

export { InputContentProvider, useInputContentContext }
