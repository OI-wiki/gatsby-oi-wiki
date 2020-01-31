/** @jsx jsx */
import { graphql, useStaticQuery } from 'gatsby'
import { jsx } from 'theme-ui'

function AuthorsArray({ authors }){
    return authors==null?null:
        authors==undefined?null:
        authors.split(',').map((author) =>{
            //while(author[0]==' ')author.shift();
            //while(author[authors.length-1]==' ')author.pop();
            return author;
        }).map((author)=>{
            return (<span> {author} </span> )
        })
}

export default AuthorsArray
