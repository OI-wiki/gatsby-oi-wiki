/** @jsx jsx */
import { jsx } from "theme-ui"
import AuthorsArray from "./AuthorsArray"
import Tags from "./Tags"
import Link from "./Link"
import { MdBuild, MdCopyright, MdEdit } from "react-icons/md"

function Meta({ authors, tags, relativePath, modifiedTime, noMeta }) {
  const editURL = "https://github.com/OI-wiki/OI-wiki/edit/master/"
  const historyURL = "https://github.com/OI-wiki/OI-wiki/commits/master/"
  if (noMeta == "false") {
    return (
      <div>
        <AuthorsArray authors={authors} />
        <Tags tags={tags} />
        <div
          sx={{
            borderLeft: "5px solid #ff1700",
            margin: "20px 0",
            paddingLeft: "1.5rem",
            textDecoration: "none",
          }}
        >
          <span>
            <MdBuild />
            本页面最近更新：
          </span>
          <span>{modifiedTime}</span>，
          <Link href={historyURL + relativePath}>
            更新历史
          </Link>
          <br />
          <span>
            <MdEdit />
            发现错误？想一起完善？{" "}
            <Link
              href={editURL + relativePath}
              title="编辑此页"
            >
              在 GitHub 上编辑此页！
            </Link>
          </span>
          <br />
          <span>
            <MdCopyright />
            本页面的全部内容在{" "}
            <strong>
              <Link href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">
                CC BY-SA 4.0
              </Link>{" "}
              和 <Link href="https://github.com/zTrix/sata-license">SATA</Link>
            </strong>{" "}
            协议之条款下提供，附加条款亦可能应用
          </span>
        </div>
      </div>
    )
  } else return <div></div>
}

export default Meta
