import React from "react"
import { graphql } from "gatsby"

import { Select } from "antd"

const { Option } = Select

import Layout from "../components/layout"
import Tags from "../components/Tags"
import Link from "../components/Link"

const BlogIndex = ({ data }, location) => {
  const { edges: posts, group } = data.allMdx
  const children = []
  group.forEach(tag => {
    children.push(<Option key={tag.fieldValue}>{tag.fieldValue}</Option>)
  })

  function handleChange(value) {
    const allPages = document.getElementsByClassName("page-listitem")
    if (value.length > 0) {
      // console.log(`selected ${value}`);
      // console.log((value))
      for (let x of allPages) {
        // console.log(x)
        x.style.display = "none"
      }
      const newTags = document.getElementsByClassName(value.join(" "))
      for (let x of newTags) {
        // console.log(x)
        x.style.display = "unset"
      }
      // console.log(document.getElementsByClassName(value.join(' ')))
    } else {
      for (let x of allPages) {
        // console.log(x)
        x.style.display = "unset"
      }
    }
  }
  return (
    <Layout location={location}>
      <h1>按标签筛选页面：</h1>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="请选择，留空展示所有页面"
        defaultValue={[]}
        onChange={handleChange}
      >
        {children}
      </Select>
      <ul>
        {posts.map(({ node: post }) => (
          <li
            key={post.id}
            className={
              (post.frontmatter.tags
                ? post.frontmatter.tags.join(" ")
                : "no-tags") + " page-listitem"
            }
            style={{ display: "unset" }}
          >
            <Link to={post.fields.slug}>
              <h2>{post.frontmatter.title}</h2>
            </Link>
            <Tags tags={post.frontmatter.tags} />
          </li>
        ))}
      </ul>
    </Layout>
  )
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
