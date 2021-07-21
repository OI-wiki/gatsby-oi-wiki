import { Card, CardActions, CardContent, Grid, TextField, Typography, useMediaQuery } from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import times from 'lodash/times'
import { graphql } from 'gatsby'
import React, { useState } from 'react'

import { SmartLink } from '../components/Link'
import Tags from '../components/Tags.tsx'
import StyledLayout from '../components/StyledLayout'

function PageItem (props) {
  const {
    id,
    frontmatter: { title, tags },
    fields: { slug: link },
  } = props
  return (
    <Grid item key={id}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component={props.linkComponent} to={link}>
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

function matchTags (pageTags, selectedTags) {
  if (selectedTags.length === 0) return true
  if (!pageTags) return false
  const matchTag = (tags, selected) => {
    return tags.includes(selected)
  }
  const res = selectedTags.map((selected) => matchTag(pageTags, selected))
  return res.every((v) => v === true)
}

function Column ({ items, linkComponent }) {
  return (
    <Grid container item xs direction="column" spacing={2}>
      {items.map(x => <PageItem key={x.id} {...x} linkComponent={linkComponent}/>)}
    </Grid>
  )
}

function GridItems (props) {
  const theme = useTheme()
  const { filteredItems } = props
  const upXL = useMediaQuery(theme.breakpoints.up('xl'))
  const upLG = useMediaQuery(theme.breakpoints.up('lg'))
  const upMD = useMediaQuery(theme.breakpoints.up('md'))
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))
  const columnCount = upXL ? 5 : upLG ? 4 : upMD ? 3 : upSmall ? 2 : 1

  return (
    <>
      {times(columnCount).map(i =>
        <Column
          key={i}
          items={filteredItems.filter((v, idx) => idx % columnCount === i)}
          linkComponent={props.linkComponent}
        />,
      )}
    </>
  )
}

function BlogIndex (props) {
  const {
    location,
    data: {
      allMarkdownRemark: { edges, group },
    },
  } = props
  const articles = edges.map(x => x.node)
  const tags = group.map(({ fieldValue }) => fieldValue)
  const [selectedTags, setSelectedTags] = useState([])
  const filteredItems = articles
    .map((x) => matchTags(x.frontmatter.tags, selectedTags) && x)
    .filter((x) => x !== false)

  return (
    <StyledLayout
      location={location}
      noMeta={true}
      noEdit={true}
      noToc={true}
      overflow={true}
      title="目录页"
    >
      <Grid container spacing={2} justify="center">
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
              return parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))
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
        <Grid item xs={12}>
          <Grid container spacing={2} justify="center">
            <GridItems filteredItems={filteredItems} linkComponent={SmartLink}/>
          </Grid>
        </Grid>
      </Grid>
    </StyledLayout>
  )
}

export const pageQuery = graphql`
  query blogIndex {
    allMarkdownRemark {
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
