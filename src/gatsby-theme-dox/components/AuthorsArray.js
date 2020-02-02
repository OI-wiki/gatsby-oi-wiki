/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { jsx } from "theme-ui";

function Header({ num }) {
    if (num <= 0) return <span>本页面未记录贡献者</span>
    if (num == 1) return <span>贡献者：</span>
    if (num > 1) return <span>贡献者们：</span>
}

function AuthorsArray({ authors }) {
  const arr =
    authors == null ? null : authors == undefined ? null : authors.split(",");
    // console.log(arr);
  return (
    <div className={`authors-list`}>
      {/* {arr.length > 1?(<span>贡献者们：</span>):(<span>贡献者：</span>)} */}
      <Header num={arr?arr.length:0}></Header>
      {arr?arr.map(author => (
        <span className={`author-name`}> {author} </span>
      )):""}
    </div>
  );
}

export default AuthorsArray;
