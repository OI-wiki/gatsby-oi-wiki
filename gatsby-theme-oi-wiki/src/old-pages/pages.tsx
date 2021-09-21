import { Card, CardActions, CardContent, Grid, TextField, Typography, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import times from 'lodash/times'
import { graphql, useStaticQuery } from 'gatsby'
import React, { useState } from 'react'

import { SmartLink } from '../components/Link'
import Tags from '../components/Tags'
import StyledLayout from '../components/StyledLayout'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'

interface PageItemInfo {
  id: string;
  frontmatter: Pick<GatsbyTypes.MarkdownRemarkFrontmatter, 'title' | 'tags'>;
  fields: Pick<GatsbyTypes.MarkdownRemarkFields, 'slug'>;
}

interface PageItemProps extends DeepWriteable<DeepRequiredNonNull<PageItemInfo>> {
  linkComponent: React.ElementType
}

const PageItem: React.FC<PageItemProps> = (props) => {
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

function matchTags(pageTags: string[], selectedTags: string[]): boolean {
  if (selectedTags.length === 0) return true
  else if (!pageTags) return false
  else return selectedTags.every((v) => pageTags.includes(v))
}

interface ColumnProps {
  items: Omit<PageItemProps, 'linkComponent'>[];
  linkComponent: PageItemProps['linkComponent'];
}

const Column: React.FC<ColumnProps> = ({ items, linkComponent }) => (
  <Grid container item xs direction="column" spacing={2}>
    {items.map(x => <PageItem key={x.id} {...x} linkComponent={linkComponent}/>)}
  </Grid>
)

interface GridItemsProps {
  filteredItems: ColumnProps['items'];
  linkComponent: PageItemProps['linkComponent'];
}

const GridItems: React.FC<GridItemsProps> = (props) => {
  const theme = useTheme()
  const { filteredItems } = props
  const upStatus = theme.breakpoints.up
  const upList = [
    useMediaQuery(upStatus('xl')),
    useMediaQuery(upStatus('lg')),
    useMediaQuery(upStatus('md')),
    useMediaQuery(upStatus('sm')),
    true,
  ]
  const columnCount = 5 - upList.indexOf(true)

  return (
    <>
      {times(columnCount).map(i =>
        <Column
          key={i}
          items={filteredItems.filter((_, idx) => idx % columnCount === i)}
          linkComponent={props.linkComponent}
        />,
      )}
    </>
  )
}

export interface BlogIndexProps {
  location: Location;
}

const BlogIndex: React.FC<BlogIndexProps> = (props) => {
  const { allMarkdownRemark: { edges, group } } = useStaticQuery<GatsbyTypes.BlogIndexQuery>(graphql`
    query BlogIndex {
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
    }`) as DeepWriteable<DeepRequiredNonNull<GatsbyTypes.BlogIndexQuery>>

  const { location } = props
  const articles = edges.map(x => x.node)
  const tags = group.map(({ fieldValue }) => fieldValue)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const filteredItems = articles.filter((v) => !!v.frontmatter.title && matchTags(v.frontmatter.tags, selectedTags))

  return (
    <StyledLayout
      location={location}
      noMeta={true}
      noEdit={true}
      noToc={true}
      overflow={true}
      title="目录页"
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Autocomplete
            value={selectedTags}
            onChange={(_, v) => {
              setSelectedTags(v)
            }}
            multiple={true}
            disableCloseOnSelect={true}
            filterSelectedOptions={true}
            options={tags}
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
          <Grid container spacing={2} justifyContent="center">
            <GridItems filteredItems={filteredItems} linkComponent={SmartLink}/>
          </Grid>
        </Grid>
      </Grid>
    </StyledLayout>
  )
}

export default BlogIndex
