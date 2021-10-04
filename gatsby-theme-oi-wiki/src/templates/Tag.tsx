import { graphql } from 'gatsby'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'
import { HistoryLocation } from '../types/location'
import React from 'react'
import Layout from '../components/Layout'
import Title from '../components/Title'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Button, ListItemIcon, ListItemText } from '@mui/material'
import { ArrowBackIos, Book } from '@mui/icons-material'

export const query = graphql`
  query TagInfo($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___title], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`


interface TagsProps {
  data: DeepWriteable<DeepRequiredNonNull<GatsbyTypes.TagInfoQuery>>;
  location: HistoryLocation;
  pageContext: {
    tag: string;
  }
}

interface TagListProps {
  edges: TagsProps['data']['allMarkdownRemark']['edges']
}


const TagList: React.FC<TagListProps> = (props) => {
  const { edges } = props
  return (
    <List>
      {edges.map((edge) => {
        const { node: { fields: { slug }, frontmatter: { title } } } = edge
        return (
          <ListItem button={true} divider={true} component="a" href={slug} key={slug}>
            <ListItemIcon>
              <Book/>
            </ListItemIcon>
            <ListItemText primary={title}/>
          </ListItem>
        )
      })}
    </List>
  )
}

const Tag: React.FC<TagsProps> = (props) => {
  const { data: { allMarkdownRemark: { edges, totalCount } }, pageContext: { tag } } = props

  return (
    <Layout title={`标签页 - ${tag}`} withToc={false} withNav={false}>
      <Title noEdit={true} relativePath="">
        共 {totalCount} 篇文章被打上了 <code>{tag}</code> 标签：
      </Title>

      <TagList edges={edges}/>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIos/>}
        href="/tags"
      >
        所有标签
      </Button>
    </Layout>
  )
}

export default Tag
