/** @jsx jsx */
import { graphql, StaticQuery } from "gatsby"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { jsx } from "theme-ui"

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
          最近更新: {hash.substr(0, 7)}, {date.substr(0, 10)}
        </Typography>
      </Grid>
    </Grid>
  )
}
