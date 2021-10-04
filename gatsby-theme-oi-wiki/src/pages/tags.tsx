import styled from '@mui/material/styles/styled'
import { graphql, useStaticQuery } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import React from 'react'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'
import { css } from '@emotion/react'
import Layout from '../components/Layout'
import Chip from '@mui/material/Chip'
import Title from '../components/Title'

const StyledChip = styled(Chip)(({ theme }) => css`
  margin: ${theme.spacing(0.5)};
`) as typeof Chip

const TagsPage: React.FC = () => {
  const { allMarkdownRemark: { group } } = useStaticQuery<GatsbyTypes.TagListQuery>(graphql`
    query TagList {
      allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `) as DeepWriteable<DeepRequiredNonNull<GatsbyTypes.TagListQuery>>

  const title = '标签页'

  return (
    <Layout title={title} withNav={false} withToc={false}>
      <Title noEdit={true} relativePath="">{title}</Title>
      {group
        .sort((a, b) => b.totalCount - a.totalCount)
        .map(({ fieldValue, totalCount }) => (
          <StyledChip
            key={fieldValue}
            label={`${fieldValue}(${totalCount})`}
            component="a"
            href={'/tags/' + kebabCase(fieldValue)}
            clickable={true}
            variant="outlined"
          />
        ))}
    </Layout>
  )
}

export default TagsPage
