import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';
import { Article, WithContext } from 'schema-dts';
import { DeepRequiredNonNull } from '../types/common';

interface SEOProps {
  title: string;
  description: string;
  article: boolean;
  author: string;
  tags: string[];
  dateModified: string;
  datePublished: string;
  image?: string
}

const SEO: React.FC<SEOProps> = (props: SEOProps) => {
  const { pathname } = useLocation();
  const { site: { siteMetadata } } = useStaticQuery<GatsbyTypes.SEOQuery>(graphql`
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
  `) as DeepRequiredNonNull<GatsbyTypes.SEOQuery>;

  const {
    title = null,
    description = null,
    article = false,
    author = '',
    tags = null,
    dateModified,
    datePublished,
  } = props;

  const seo = {
    title: title || siteMetadata.defaultTitle,
    description: description || siteMetadata.defaultDescription,
    image: 'https://cdn.jsdelivr.net/npm/oicdn@0.0.2/wordArt.webp',
    url: `${siteMetadata.siteUrl}${pathname}`,
    author: author && author.split(','),
    tags: tags,
  };

  const schemaMarkUp: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.title,
    image: [seo.image],
    datePublished: datePublished,
    dateModified: dateModified,
    mainEntityOfPage: seo.url,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OI Wiki',
      logo: {
        '@type': 'ImageObject',
        url: seo.image,
      },
    },
  };

  return (
    <Helmet>
      <meta name="description" content={seo.description}/>
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={`https://oi-wiki.org${pathname}`}/>

      {seo.url && <meta property="og:url" content={seo.url}/>}

      {article && <meta property="og:type" content="article"/>}
      {seo.tags && seo.tags.map((tag) => <meta key={tag} property="og:article:tag" content={tag}/>)}
      {seo.author && seo.author.map((author) => <meta key={author} property="og:article:author" content={author}/>)}

      {seo.title && <meta property="og:title" content={seo.title}/>}

      {seo.description && <meta property="og:description" content={seo.description}/>}

      {seo.image && <meta property="og:image" content={seo.image}/>}

      <meta name="twitter:card" content="summary_large_image"/>

      {seo.title && <meta name="twitter:title" content={seo.title}/>}

      {seo.description && <meta name="twitter:description" content={seo.description}/>}

      {seo.image && <meta name="twitter:image" content={seo.image}/>}
      {schemaMarkUp && <script type="application/ld+json">{JSON.stringify(schemaMarkUp, null, 2)}</script>}
    </Helmet>
  );
};

export default SEO;
