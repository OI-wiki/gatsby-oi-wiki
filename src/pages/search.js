/** @jsx jsx */
import Grid from "@material-ui/core/Grid"
import React from "react"
import { jsx } from "theme-ui"
import Layout from "../components/Layout"
import Search from "../components/Search"

function SearchPage(props) {
  const { location } = props

  return (
    <Layout
      location={location}
      noMeta={"true"}
      noEdit={"true"}
      noToC={"true"}
      title={"搜索效果页"}
    >
      <Grid container spacing={2} justify={"center"}>
        <Search/>
      </Grid>
    </Layout>
  )
}

export default SearchPage
