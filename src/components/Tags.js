/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby"
import { jsx } from "theme-ui"
import { Card } from "antd"

function Header({ num }) {
  if (num <= 0) return <span>本页面没有标签</span>
  return <span>标签</span>
}

function Tags({ tags }) {
  const arr = tags
  return (
    <Card
      size="small"
      className={`tags-list`}
      style={{
        background: "#fff",
        padding: 2,
        marginTop: 12,
      }}
    >
      <Header num={arr ? arr.length : 0}></Header>
      {arr
        ? arr.map(tag => (
            <a className={`tag-item`} href={"/tags/" + tag}>
              {" "}
              {tag}{" "}
            </a>
          ))
        : ""}
    </Card>
  )
}

export default Tags
