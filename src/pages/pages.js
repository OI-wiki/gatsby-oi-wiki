/** @jsx jsx */
import { useMediaQuery } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Autocomplete from "@material-ui/lab/Autocomplete"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import { graphql } from "gatsby"
import React, { useState } from "react"
import { jsx } from "theme-ui"
import Layout from "../components/Layout"
import Link from "../components/Link"
import Tags from "../components/Tags"

const useStyles = makeStyles({})

function PageItem(props) {
  const classes = useStyles()
  const {
    id,
    frontmatter: { title, tags },
    fields: { slug: link },
  } = props
  return (
    <Grid item key={id}>
      <Card variant={"outlined"}>
        <CardContent>
          <Typography variant="h6" component={Link} to={link}>
            {title}
          </Typography>
        </CardContent>
        <CardActions>
          <Tags tags={tags}/>
        </CardActions>
      </Card>
    </Grid>
  )
}

function matchTags(pageTags, selectedTags) {
  if (selectedTags.length === 0) return true
  if (!pageTags) return false
  const matchTag = (tags, selected) => {
    return tags.includes(selected)
  }
  const res = selectedTags.map((selected) => matchTag(pageTags, selected))
  return res.every((v) => v === true)
}

function GridItems(props) {
  const theme = useTheme()
  const { filteredItems } = props
  let columnCount
  const upXL = useMediaQuery(theme.breakpoints.up("lg"))
  const upSmall = useMediaQuery(theme.breakpoints.up("sm"))
  if (upXL) {
    columnCount = 3
    return (
      <>
        <Grid container item xs direction={"column"} spacing={2} >
          {filteredItems.map((x, idx) => idx % columnCount === 0 && <PageItem key={x.id} {...x} />)}
        </Grid>
        <Grid container item xs direction={"column"} spacing={2}>
          {filteredItems.map((x, idx) => idx % columnCount === 1 && <PageItem key={x.id} {...x} />)}
        </Grid>
        <Grid container item xs direction={"column"} spacing={2}>
          {filteredItems.map((x, idx) => idx % columnCount === 2 && <PageItem key={x.id} {...x} />)}
        </Grid>
      </>
    )
  } else if (upSmall) {
    columnCount = 2
    return (
      <>
        <Grid container item xs direction={"column"} spacing={2}>
          {filteredItems.map((x, idx) => idx % columnCount === 0 && <PageItem key={x.id} {...x} />)}
        </Grid>
        <Grid container item xs direction={"column"} spacing={2}>
          {filteredItems.map((x, idx) => idx % columnCount === 1 && <PageItem key={x.id} {...x} />)}
        </Grid>
      </>
    )
  } else {
    columnCount = 1
    return (
      <>
        <Grid container item direction={"column"} spacing={2}>
          {filteredItems.map(x => <PageItem key={x.id} {...x} />)}
        </Grid>
      </>
    )
  }
}

function BlogIndex(props) {
  const { location } = props
  const {
    data: {
      allMdx: { edges, group },
    },
  } = props
  const articles = edges.map((x) => x.node)
  const tags = group.map(({ fieldValue }) => fieldValue)
  const [selectedTags, setSelectedTags] = useState([])
  const filteredItems = articles.map((x) => matchTags(x.frontmatter.tags, selectedTags) && x).filter(x => x !== false)
  return (
    <Layout
      location={location}
      noMeta={"true"}
      noEdit={"true"}
      noToC={"true"}
      overflow={"true"}
      title={"目录页"}
    >
      <Grid container spacing={2} justify={"center"}>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedTags}
            onChange={(_, v) => {
              setSelectedTags(v)
            }}
            multiple
            options={tags}
            disableCloseOnSelect
            filterSelectedOptions
            getOptionLabel={(option) => option}
            renderOption={(option, { inputValue }) => {
              const matches = match(option, inputValue)
              const parts = parse(option, matches)
              return (
                parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                      {part.text}
                    </span>
                ))
              )
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="键入以按标签搜索..."
              />
            )}
          />
        </Grid>
        <Grid container xs={12} spacing={2} justify={"center"}>
          <GridItems filteredItems={filteredItems}/>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const pageQuery = graphql`
  query blogIndex {
    allMdx {
      edges {
        node {
          id
          frontmatter {
            title
            tags
          }
          fields {
            slug
          }
        }
      }
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
export default BlogIndex
