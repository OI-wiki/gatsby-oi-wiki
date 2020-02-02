/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { jsx } from "theme-ui";

function Header({ num }) {
    if (num <= 0) return <span>本页面没有标签</span>
    return <span>标签</span>
}

function Tags({ tags }) {
  const arr=tags
  return (
    <div className={`tags-list`}>
      <Header num={arr?arr.length:0}></Header>
      {arr?arr.map(tag => (
        <span className={`tag-item`}> {tag} </span>
      )):""}
    </div>
  );
}

export default Tags;
