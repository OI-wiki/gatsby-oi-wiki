/** @jsx jsx */
import { jsx } from "theme-ui"
import { Anchor } from 'antd';
const { Link } = Anchor;

function TocItem({ tocNode,key,...props }) {
  return (
    <Link href={tocNode.url?tocNode.url:null} title={tocNode.title?tocNode.title:null} key={key} >
      {tocNode.items? 
          tocNode.items.map( (subNode,id) => (
            <TocItem tocNode={subNode} key={`${key}-${id}`}/>
          ))
      : (
        ""
      )}
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

export default function({ toc, key, ...props }) {
  //let tocIDs = []
  //if (toc && toc.items) {
  //  toc.items.forEach(node => {
  //    tocIDs = tocIDs.concat(getIDs(node))
  //  })
  //}
  return (
    <div className="toc" {...props}>
      {toc && toc.items ? (
        <Anchor offsetTop="18" >
          {toc.items.map( (subNode,id) => (
            <TocItem tocNode={subNode} key={`${key}-${id}`} />
          ))}
        </Anchor>
      ) : (
        ""
      )}
    </div>
  )
}
