/** @jsx jsx */
import { jsx } from "theme-ui"
import React, { useState } from "react"
import { graphql } from "gatsby"
import Checkbox from "@material-ui/core/Checkbox"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import Layout from "../components/Layout"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import parse from "autosuggest-highlight/parse"
import match from "autosuggest-highlight/match"
import Link from "../components/Link"
import Tags from "../components/Tags"
import CardActions from "@material-ui/core/CardActions"

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>
const checkedIcon = <CheckBoxIcon fontSize="small"/>
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
})

function PageItem(props) {
  const classes = useStyles()
  const {
    id,
    frontmatter: { title, tags },
    fields: { slug: link },
  } = props
  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
      <Card className={classes.root} variant={"outlined"}>
        <CardContent>
          <Typography variant="h5" component={Link} to={link}>
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
  if (selectedTags.length === 0)
    return true
  if (!pageTags)
    return false
  const matchTag = (tags, selected) => {
    return tags.includes(selected)
  }
  const res = selectedTags.map(selected => matchTag(pageTags, selected))
  return res.every(v => v === true)
}

function BlogIndex(props) {
  const { location } = props
  const {
    data: {
      allMdx: {
        edges,
        group,
      },
    },
  } = props
  const articles = edges.map(x => x.node)
  const tags = group.map(({ fieldValue }) => fieldValue)
  const [selectedTags, setSelectedTags] = useState([])
  return (
    <Layout location={location} noMeta={"true"} noEdit={"true"} title={"目录页"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedTags}
            onChange={(_, v) => {
              setSelectedTags(v)
            }}
            multiple
            options={tags}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(option, { inputValue, selected }) => {
              const matches = match(option, inputValue)
              const parts = parse(option, matches)
              return (
                <>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </>)
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="搜索标签..." placeholder="搜索标签..."/>
            )}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
      >
        {
          articles.map(
            x => (matchTags(x.frontmatter.tags, selectedTags) &&
              <PageItem {...x}/>)
          )
        }
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
