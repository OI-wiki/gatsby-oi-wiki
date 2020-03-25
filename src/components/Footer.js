/** @jsx jsx */
import { StaticQuery, graphql } from "gatsby"
import { Row, Col } from "antd"
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
    <Row>
      <Col span={24}>
        <div className="footer-right">
          Copyright © 2016 - {date.substr(0, 4)} OI Wiki Team
        </div>
      </Col>
      <Col span={24}>
        最近更新: {hash.substr(0, 7)}, {date.substr(0, 10)}
      </Col>
    </Row>
  )
}
