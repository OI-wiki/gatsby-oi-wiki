import { Button, CircularProgress, Divider, makeStyles, Tooltip, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Giscus from '@giscus/react'
import useDarkMode from '../../lib/useDarkMode'

interface Props {
  repo: string, // 存储库名
  id: string, // 文章 id
  repoid: string // giscus 上获取的 repoid
}

const CommentComponent: React.FC<Props> = (props) => {
  const isAdmin = props.admin.indexOf(user.username) >= 0
  let colorScheme = 'light'
  if (useDarkMode) {
    colorScheme = 'dark'
  }
  return (
    <Giscus
      id = "comments"
      repo = { props.repo }
      repoId = { props.repoid }
      category = "Announcements"
      categoryId = "__________" // 到部署时候自己填!!!!!!!
      mapping = "specific"
      term = { props.id }
      reactionsEnabled = "1"
      emitMetadata = "0"
      inputPosition = "top"
      theme = { colorScheme }
      lang = "zh_cn"
      loading = "lazy"
    />
  )
}

export default CommentComponent
