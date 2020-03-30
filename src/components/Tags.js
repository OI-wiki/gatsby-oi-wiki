/** @jsx jsx */
import { jsx } from "theme-ui"
import "@material/react-chips/dist/chips.css"
import { ChipSet, Chip } from "@material/react-chips"
import kebabCase from "lodash/kebabCase"
import Link from "./Link"

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
          ? arr.map((tag) => (
            <Link href={"/tags/" + kebabCase(tag)} key={`tag-${tag}`}>
                <Chip label={`tag-item`} label={` ${tag} `}></Chip>
            </Link>
            ))
          : ""}
      </ChipSet>
    </div>
  )
}

export default Tags
