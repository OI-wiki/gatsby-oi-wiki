/* eslint-disable react/jsx-key */
import React from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql } from 'gatsby'

interface Props {
  title: string;
  description: string;
  image: string;
  article: boolean;
  author: string;
  tags: string[];
  dateModified: string;
  datePublished: string;
}

const SEO: React.FC<Props> = (props: Props) => {
  const {
    title = null,
    description = null,
    image = null,
    article = false,
    author = null,
    tags = null,
    dateModified,
    datePublished,
  } = props
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultAuthor,
  } = site.siteMetadata

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image}`,
    url: `${siteUrl}${pathname}`,
    author: author && author.split(','),
    tags: tags,
  }

  const schemaMarkUp = {
    headline: seo.title,
    image: [''],
    datePublished: datePublished,
    dateModified: dateModified,
  }
  schemaMarkUp['@context'] = 'https://schema.org'
  schemaMarkUp['@type'] = 'Article'
  return (
    <Helmet title={seo.title}>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      {seo.url && <meta property="og:url" content={seo.url} />}

      {article && <meta property="og:type" content="article" />}
      {seo.tags && seo.tags.map((tag) => <meta property="og:article:tag" content={tag} />)}
      {seo.author && seo.author.map((author) => <meta property="og:article:author" content={author} />)}

      {seo.title && <meta property="og:title" content={seo.title} />}

      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}

      {seo.image && <meta property="og:image" content={seo.image} />}

      <meta name="twitter:card" content="summary_large_image" />

      {seo.title && <meta name="twitter:title" content={seo.title} />}

      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}

      {seo.image && <meta name="twitter:image" content={seo.image} />}
      {schemaMarkUp && <script type="application/ld+json">{JSON.stringify(schemaMarkUp, null, 2)}</script>}
    </Helmet>
  )
}

export default SEO

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        siteUrl
        defaultAuthor: author
      }
    }
  }
`
