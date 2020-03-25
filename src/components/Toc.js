/** @jsx jsx */
import { jsx } from "theme-ui"
import { Anchor } from "antd"
const { Link } = Anchor

function TocItem({ tocNode, kkey, ...props }) {
  return (
    <Link
      href={tocNode.url ? tocNode.url : null}
      title={tocNode.title ? tocNode.title : null}
      key={kkey}
    >
      {tocNode.items
        ? tocNode.items.map((subNode, id) => (
            <TocItem
              tocNode={subNode}
              kkey={`${kkey}-${id}`}
              key={`${kkey}-${id}`}
            />
          ))
        : ""}
    </Link>
  )
}

//function getIDs(node) {
//  let res = node.url ? [node.url.slice(1)] : []
//  if (node.items) {
//    node.items.forEach(ele => {
//      res = res.concat(getIDs(ele))
//    })
//  }
//  return res
//}

export default function ({ toc, key, ...props }) {
  //let tocIDs = []
  //if (toc && toc.items) {
  //  toc.items.forEach(node => {
  //    tocIDs = tocIDs.concat(getIDs(node))
  //  })
  //}
  return (
    <div className="toc" {...props}>
      {toc && toc.items ? (
        <Anchor offsetTop="18">
          {toc.items.map((subNode, id) => (
            <TocItem
              tocNode={subNode}
              kkey={`${key}-${id}`}
              key={`${key}-${id}`}
            />
          ))}
        </Anchor>
      ) : (
        ""
      )}
    </div>
  )
}
