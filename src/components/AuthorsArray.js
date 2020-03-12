/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby"
import { jsx } from "theme-ui"
import { Card } from "antd"
import { ChipSet, Chip } from '@material/react-chips'

function Header({ num }) {
  if (num <= 0) return <span>本页面未记录贡献者</span>
  if (num == 1) return <span>贡献者：</span>
  if (num > 1) return <span>贡献者们：</span>
}
function AuthorsArray({ authors }) {
  const arr =
    authors == null ? null : authors == undefined ? null : authors.split(",")
  // console.log(arr);
  return (
    <div>
      <Header num={arr ? arr.length : 0}></Header>
      <ChipSet>
        {arr
          ? arr.map(author => (
            <Chip label={` ${author} `} key={author}>
            </Chip>
          ))
          : ""}
      </ChipSet>
    </div>
  )
}

export default AuthorsArray
