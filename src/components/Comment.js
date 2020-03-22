/** @jsx jsx */
import "gitalk/dist/gitalk.css"
import GitalkComponent from "gitalk/dist/gitalk-component"
// import GitalkComponent from 'gitalk/src/gitalk'
import { jsx } from "theme-ui"
import { Card } from "antd"
import theme from "../theme"

function Gitalk({ title, noComment }) {
  // console.log(noComment,  title)
  if (noComment == "false") {
    return (
      <GitalkComponent
        options={{
          id: title,
          owner: "OI-wiki",
          repo: "gitment",
          admin: ["24OI-bot"],
          clientID: "d6a911c8fba0194626d4",
          clientSecret: "867ec7e13cc99b420bd147cbb62d5cfec271ba81",
          distractionFreeMode: false,
          pagerDirection: "first",
        }}
      />
    )
  } else return <div></div>
}

export default Gitalk
