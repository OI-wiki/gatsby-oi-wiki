import { Link, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { graphql, StaticQuery } from 'gatsby'
import React, { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.footer.text,
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.link.hover,
    },
    transition: `color ${250}ms ease-in-out`,
  },
}))

let easteregg = false

function FooterContent ({ data }) {
  const classes = useStyles()
  const { date, hash } = data.allGitCommit.nodes[0]

  useEffect(() => {
    // eslint-disable-next-line quotes
    const SchoolIcon = `background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path transform='translate(0 12) scale(6)' d='M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z'/></svg>")`
    if (typeof window !== 'undefined' && !easteregg++) {
      console.log(`%cOI Wiki %c ${hash.substr(0, 7)} `, `${SchoolIcon}; font-size: 1.5em; padding: 10em 5em 1em 0;`, 'background:#41b883; margin-left: -7.5em; padding: .2em; border-radius: 3px; color: #fff;')
      console.log('%c少年，恭喜你发现彩蛋一枚。我们在做一些 OI 相关的有趣的事情。\n如果您对此感兴趣，欢迎访问 https://join-us.oi-wiki.org', 'font-size: 1.4em; line-height: 1.5;')
    }
  })

  return (
    <>
      <Typography gutterBottom>
        Copyright © 2016 - {date.substr(0, 4)} OI Wiki Team
        </Typography>
      <Typography gutterBottom>
        {'最近更新： '}
        <Link
          className={classes.link}
          href="https://github.com/OI-wiki/OI-wiki/commits"
          target="_blank"
          rel="noreferrer noopener"
        >
          {hash.substr(0, 7)}
        </Link>
          , {date.substr(0, 10)}
      </Typography>
      <Typography>
        {'联系方式：'}
        <Link className={classes.link} href="https://t.me/OIwiki" target="_blank" rel="noreferrer noopener">
          {'Telegram 群组'}
        </Link>{' / '}
        <Link
          className={classes.link}
          href="https://jq.qq.com/?_wv=1027&k=5EfkM6K"
          target="_blank"
          rel="noreferrer noopener"
        >
          {'QQ 群组'}
        </Link>
      </Typography>
    </>
  )
}

const query = (props) => (
  <StaticQuery
    query={graphql`
      query lastestCommit {
        allGitCommit(limit: 1) {
          nodes {
            hash
            date
          }
        }
      }
    `}
    render={(data) => <FooterContent data={data} {...props} />}
  />
)
export default query
