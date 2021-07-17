import { Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { graphql, useStaticQuery } from 'gatsby'
import React, { useEffect } from 'react'
import { SmartLink } from './Link'

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.footer.text,
  },
}))

const Footer: React.FC = () => {
  const classes = useStyles()
  const data = useStaticQuery<GatsbyTypes.lastestCommitQuery>(graphql`
    query lastestCommit {
      allGitCommit(limit: 1) {
        nodes {
          hash
          date
        }
      }
    }
  `)

  const { date, hash } = data.allGitCommit.nodes[0]
  const hashFrag = hash?.substr(0, 7)
  const dateStr = date?.toString()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SchoolIcon = 'background: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><path transform=\'translate(0 12) scale(6)\' d=\'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z\'/></svg>")'
      console.log(`%cOI Wiki %c ${hashFrag} `, `${SchoolIcon}; font-size: 1.5em; padding: 10em 5em 1em 0;`, 'background:#41b883; margin-left: -7.5em; padding: .2em; border-radius: 3px; color: #fff;')
      console.log('%c少年，恭喜你发现彩蛋一枚。我们在做一些 OI 相关的有趣的事情。\n如果您对此感兴趣，欢迎访问 https://join-us.oi-wiki.org', 'font-size: 1.4em; line-height: 1.5;')
    }
  }, [hash, hashFrag])

  return (
    <>
      <Typography gutterBottom>
        Copyright © 2016 - {dateStr?.substr(0, 4)} OI Wiki Team
      </Typography>
      <Typography gutterBottom>
        {'最近更新： '}
        <SmartLink className={classes.link} href="https://github.com/OI-wiki/OI-wiki/commits">
          {hashFrag}
        </SmartLink>
        , {dateStr?.substr(0, 10)}
      </Typography>
      <Typography>
        联系方式：
        <SmartLink className={classes.link} href="https://t.me/OIwiki">
          Telegram 群组
        </SmartLink>{' / '}
        <SmartLink className={classes.link} href="https://jq.qq.com/?_wv=1027&k=5EfkM6K">
          QQ 群组
        </SmartLink>
      </Typography>
    </>
  )
}

export default Footer
