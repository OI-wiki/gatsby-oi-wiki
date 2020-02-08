/** @jsx jsx */
import { jsx } from 'theme-ui'
import Scrollspy from 'react-scrollspy'

function TocItem({ tocNode }) {
    // console.log(tocNode, 'toc')
    return (
        <li>
            {(tocNode.url && tocNode.title)?<a href={tocNode.url}>{tocNode.title}</a>:''}
            {tocNode.items != undefined && tocNode.items != null ?  (
                <ul>
                    {tocNode.items.map( subNode => (<TocItem tocNode={subNode} />))}
                </ul>
            ):''}
        </li>
    )
}

function getIDs(node) {
    // console.log(node)
    let res = node.url?[node.url.slice(1)]:[];
    // console.log(res, '??')
    if (node.items) {
        node.items.forEach(ele => {
            res = res.concat(getIDs(ele))
            // console.log('ele', ele, res)
        });
    }
    return res;
}

export default function({ toc, ...props }){
    if (toc && toc.items) toc = toc.items[0].items[0];
    // console.log(toc, toc.items, 'items')
    let tocIDs = []
    toc.items.forEach(node => {
        tocIDs = tocIDs.concat(getIDs(node))
    })
    // console.log(tocIDs)
    return  (
        <div className='toc' {...props} >
            {
                toc && toc.items ? (
                <Scrollspy items={tocIDs} currentClassName="is-current">
                    {toc.items.map( subNode => (<TocItem tocNode={subNode} />))}
                </Scrollspy>
            ) : ''}
        </div>
    )
}
