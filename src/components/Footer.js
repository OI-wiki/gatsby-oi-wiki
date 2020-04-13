/** @jsx jsx */
import Grid from "@material-ui/core/Grid"
import Link from '@material-ui/core/Link';
import Typography from "@material-ui/core/Typography"
import { graphql, StaticQuery } from "gatsby"
import { jsx } from "theme-ui"
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"


const useStyles = makeStyles((theme) => ({
  link: {
    color: "#616161",
    "&:hover": {
      textDecoration: "none",
      color: "#1a73e8"
    },
  }
}))

export default (props) => (
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

function FooterContent({ data }) {
  const classes = useStyles()
  const theme = useTheme()
  let { date, hash } = data.allGitCommit.nodes[0]
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography>
          Copyright © 2016 - {date.substr(0, 4)} OI Wiki Team
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          最近更新: <Link className={classes.link} href={"https://github.com/OI-wiki/OI-wiki/commits"}>{hash.substr(0, 7)}</Link>, {date.substr(0, 10)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          联系方式：<Link className={classes.link} href={"https://t.me/OIwiki"}>Telegram 群组</Link> / <Link className={classes.link} href={"https://jq.qq.com/?_wv=1027&k=5EfkM6K"}>QQ 群组</Link>
        </Typography>
      </Grid>
    </Grid>
  )
}
