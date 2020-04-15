import GitalkComponent from "gitalk/dist/gitalk-component"
import "gitalk/dist/gitalk.css"
import React from "react"

function Gitalk({ title }) {
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
}

export default Gitalk
