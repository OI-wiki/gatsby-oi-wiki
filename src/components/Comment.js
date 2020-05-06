import Utterances from 'utterances-react'
import React from 'react'

function Comment () {
  return (
    <Utterances
      repo="OI-wiki/gitment"
      issueTerm="title"
      theme="github-light"
      crossorigin="anonymous"
      async
    />
  )
}

export default Comment
