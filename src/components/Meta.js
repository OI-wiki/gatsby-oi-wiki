/** @jsx jsx */
import { jsx } from "theme-ui"
import { Card } from "antd"
import AuthorsArray from "./AuthorsArray"
import Tags from "./Tags"
import { MdBuild, MdCopyright, MdEdit } from "react-icons/md"
import theme from "../theme"

function Meta({ authors, tags, relativePath, modifiedTime, noMeta }) {
  const editURL = "https://github.com/OI-wiki/OI-wiki/edit/master/"
  const historyURL = "https://github.com/OI-wiki/OI-wiki/commits/master/"
  if (noMeta == "false") {return (
    <Card sx={{ lineHeights: theme.lineHeights.body }}>
      <AuthorsArray authors={authors} />
      <Tags tags={tags} />
      <div
        sx={{
          borderLeft: "5px solid #ff1700",
          margin: "20px 0",
          paddingLeft: "1.5rem",
        }}
      >
        <span>
          <MdBuild />
          本页面最近更新：
        </span>
        <span className="facts_modified">{modifiedTime}</span>，
        <a className="edit_history" href={historyURL + relativePath}>
          更新历史
        </a>
        <br />
        <span>
          <MdEdit />
          发现错误？想一起完善？{" "}
          <a
            href={editURL + relativePath}
            title="编辑此页"
            className="page_edit_url"
          >
            在 GitHub 上编辑此页！
          </a>
        </span>
        <br />
        <span>
          <MdCopyright />
          本页面的全部内容在{" "}
          <strong>
            <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">
              CC BY-SA 4.0
            </a>{" "}
            和 <a href="https://github.com/zTrix/sata-license">SATA</a>
          </strong>{" "}
          协议之条款下提供，附加条款亦可能应用
        </span>
      </div>
    </Card>
  )} else return (<div></div>);
}

export default Meta
