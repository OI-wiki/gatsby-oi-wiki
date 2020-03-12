/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby"
import { jsx } from "theme-ui"
import { Card } from "antd"
import "@material/react-chips/dist/chips.css"
import { ChipSet, Chip } from '@material/react-chips'


function Header({ num }) {
  if (num <= 0) return <span>本页面没有标签</span>
  return <span>标签：</span>
}

function Tags({ tags }) {
  const arr = tags
  return (
    <div>
      <Header num={arr ? arr.length : 0}></Header>
      <ChipSet>
        {arr
          ? arr.map(tag => (
            <a href={"/tags/" + tag} key={`tag-${tag}`}>
              <Chip label={`tag-item`} label={` ${tag} `} >
              </Chip >
            </a>
          ))
          : ""}
      </ChipSet>
    </div>
  )
}

export default Tags
