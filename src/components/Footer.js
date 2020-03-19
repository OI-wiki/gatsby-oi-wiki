/** @jsx jsx */
import { StaticQuery, graphql } from "gatsby"
import { Row, Col } from "antd"
import { jsx } from "theme-ui"

export default props => (
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
    render={data => <FooterContent data={data} {...props} />}
  />
)

function FooterContent({ data }) {
  let lastestCommit = data.allGitCommit.nodes[0]

  return (
    <Row
      sx={{
        display: "block",
      }}
    >
      <Col span={8}>
        <div className="footer-right">Copyright © 2016 - 2020 OI Wiki Team</div>
      </Col>
      <Col span={8}>
        最近更新: {lastestCommit.hash.substr(0, 7)},{" "}
        {lastestCommit.date.substr(0, 10)}
      </Col>
    </Row>
  )
}
