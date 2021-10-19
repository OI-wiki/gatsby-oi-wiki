import times from 'lodash/times'
import { graphql, useStaticQuery } from 'gatsby'
import React, { useMemo, useState } from 'react'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Tags from '../components/Tags'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useTheme from '@mui/material/styles/useTheme'
import Layout from '../components/Layout'
import SmartLink from '../components/SmartLink'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Title from '../components/Title'


interface PageItemInfo {
  id: string;
  frontmatter: Partial<Pick<GatsbyTypes.MarkdownRemarkFrontmatter, 'title' | 'tags'>>;
  fields: Partial<Pick<GatsbyTypes.MarkdownRemarkFields, 'slug'>>;
}

interface PageItemProps extends DeepWriteable<DeepRequiredNonNull<PageItemInfo>> {
  linkComponent: React.ElementType
}


const PageItem: React.FC<PageItemProps> = (props) => {
  const {
    frontmatter: { title, tags },
    fields: { slug: link },
    linkComponent,
  } = props

  return (
    <Grid item={true}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component={linkComponent} to={link}>
            {title}
          </Typography>
        </CardContent>

        <CardActions>
          {!!tags && <Tags tags={tags}/>}
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
  <Grid container={true} item={true} xs={true} direction="column" spacing={2}>
    {items.map(props => <PageItem key={props.id} {...props} linkComponent={linkComponent}/>)}
  </Grid>
)

interface GridItemsProps {
  filteredItems: ColumnProps['items'];
  linkComponent: PageItemProps['linkComponent'];
}

const GridItems: React.FC<GridItemsProps> = (props) => {
  const { filteredItems } = props

  const theme = useTheme()
  const columnCount = useMemo(() => {
    const matchIndex = theme.breakpoints.keys.reverse().findIndex((key, i, arr) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key), { noSsr: true })
      return matches || i === arr.length - 1
    })
    return 5 - matchIndex
  }, [theme.breakpoints])

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

const PagesPage: React.FC = () => {
  const { allMarkdownRemark: { edges, group } } = useStaticQuery<GatsbyTypes.PageListQuery>(graphql`
    query PageList {
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
    }`) as DeepWriteable<DeepRequiredNonNull<GatsbyTypes.PageListQuery>>

  const articles = edges.map(x => x.node)
  const tags = group.map(({ fieldValue }) => fieldValue)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const filteredItems = articles.filter((v) => !!v.frontmatter.title && matchTags(v.frontmatter.tags, selectedTags))
  const title = '目录页'

  return (
    <Layout withToc={false} withNav={false} title={title}>
      <Title noEdit={true} relativePath="">{title}</Title>
      <Grid container={true} spacing={2} justifyContent="center">
        <Grid item={true} xs={12}>
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
            renderOption={(_, option, { inputValue }) => {
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
    </Layout>
  )
}

export default PagesPage
