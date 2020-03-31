/** @jsx jsx */
import { jsx } from "theme-ui"
import { Chip, ChipSet } from "@material/react-chips"
import Link from "./Link"

function Header({ num }) {
  if (num <= 0) return <span>本页面未记录贡献者</span>
  if (num === 1) return <span>贡献者：</span>
  if (num > 1) return <span>贡献者们：</span>
}

function AuthorsArray({ authors }) {
  const arr = authors == null ? null : authors ? null : authors.split(",")
  return (
    <div>
      <Header num={arr ? arr.length : 0}/>
      <ChipSet>
        {arr
          ? arr.map((author) => (
            <Link href={"https://github.com/" + author.trim()} key={author}>
              <Chip label={` ${author} `}/>{" "}
            </Link>
          ))
          : ""}
      </ChipSet>
    </div>
  )
}

export default AuthorsArray
