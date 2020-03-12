import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Tags from "../components/Tags"
import Link from "../components/Link"
import { Card, Row, Col, Select } from "antd"
const { Option } = Select

class BlogIndex extends React.Component {
  data
  location
  children = []
  posts
  group
  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: [],
    }
    this.data = props.data
    this.location = props.location
    const { edges: posts, group } = this.data.allMdx
    this.posts = posts
    this.group = group
    this.group.forEach(tag => {
      this.children.push(<Option key={tag.fieldValue}>{tag.fieldValue}</Option>)
    })
  }
  handleChange(value) {
    this.setState({
      selectedKeys: value,
    })
  }
  render() {
    return (
      <Layout location={this.location}>
        <h1>按标签筛选页面：</h1>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="请选择，留空展示所有页面"
          defaultValue={[]}
          onChange={this.handleChange.bind(this)}
        >
          {this.children}
        </Select>
        <Row gutter={16}>
          {this.posts.map(({ node: post }) => {
            let allKeys = [...this.state.selectedKeys]
            let isSelected
            let tags = post.frontmatter.tags || []
            if (allKeys === []) {
              isSelected = true
            } else {
              isSelected = allKeys
                .map(x =>
                  tags.reduce((prev, curr) => prev || curr === x, false)
                )
                .reduce((prev, curr) => prev && curr, true)
            }
            if (!isSelected) return <div key={post.id} />
            else
              return (
                <Col span={8} key={post.id}>
                  <Card
                    title={
                      <a
                        href={post.fields.slug}
                        sx={{
                          ":hover": {
                            color: "#1E90FF",
                            textDecoration: "none",
                          },
                          color: "black",
                        }}
                      >
                        {" "}
                        {post.frontmatter.title || "本页面没有标题"}{" "}
                      </a>
                    }
                    bordered={true}
                  >
                    <Tags tags={tags} />
                  </Card>
                </Col>
              )
          })}
        </Row>
      </Layout>
    )
  }
}
export const pageQuery = graphql`
  query blogIndex {
    allMdx {
      edges {
        node {
          id
          frontmatter {
            title
            tags
          }
          fields {
            slug
          }
        }
      }
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
export default BlogIndex
