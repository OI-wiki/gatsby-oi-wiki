/** @jsx jsx */
import { css, jsx, Styled, useThemeUI } from 'theme-ui'

function TocItem({ tocNode }) {
    return (
        <li>
            <a href={tocNode.url}>{tocNode.title}</a>
            {tocNode.items != undefined && tocNode.items != null ?  (
                <ul>
                    {tocNode.items.map( subNode => (<TocItem tocNode={subNode} />))}
                </ul>
            ):''}
        </li>
    )
}

export default function({ toc }){
    const { theme } = useThemeUI()
    return  (
        <div
            sx={theme.layout.toc}
            className='toc'
        >
            {toc != undefined && toc != null && toc.items != undefined && toc.items != null? (
                <ul>
                    <TocItem tocNode={toc.items[0]} />
                </ul>
            ) : ''}
        </div>
    )
}
