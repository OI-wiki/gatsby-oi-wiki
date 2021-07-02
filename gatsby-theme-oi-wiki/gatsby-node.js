const _ = require('lodash')
const git = require('simple-git')
const { createFilePath } = require('gatsby-source-filesystem')
const path = require('path')
const { CreateSitemap, CreateIndexSitemap, CreateSitemapStylesheet } = require('sitemap-manager')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
       alias: {
          path: require.resolve("path-browserify")
       },
       fallback: {
         fs: false,
       }
    }
  })
}

const gitQuery = async function (prop) {
  const res = await git().log(['-15', prop]).catch(err => console.log(err))
  return res
}
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  // you only want to operate on `Mdx` nodes. If you had content from a
  // remote CMS you could also check to see if the parent node was a
  // `File` node here
  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: 'slug', // Name of the field you are adding
      node: node, // Individual MDX node
      // Generated value based on filepath with "blog" prefix. you
      // don't need a separating "/" before the value because
      // createFilePath returns a path with the leading "/".
      value: `${value}`,
    })
    createNodeField({ // whether it is a index.md
      name: 'isIndex',
      node: node,
      value: /index\.(md|markdown|mdx|mdtext)$/.test(node.fileAbsolutePath),
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const docTemplate = require.resolve('./src/templates/doc.js')
  const tagTemplate = require.resolve('./src/templates/tags.js')
  const logTemplate = require.resolve('./src/templates/changelog.js')

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___title] }
        limit: 2000
      ) {
        edges {
          node {
            fields {
              slug
            }
            id
            frontmatter {
              tags
              title
            }
            fileAbsolutePath
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `)

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  const posts = result.data.postsRemark.edges
  // console.log(posts)
  // Create post detail pages

  for (const index in posts) {
    const { node } = posts[index]

    const previous = index === posts.length - 1 ? null : posts[index + 1]
    const next = index === 0 ? null : posts[index - 1]
    // /workspace/gatsby-oi-wiki/docs/empty.md -> docs/empty.md
    const { fileAbsolutePath: path } = node
    const relativePath = path.slice(path.indexOf('/docs') + 1)

    const log = await gitQuery(relativePath)
    createPage({
      path: node.fields.slug,
      component: docTemplate,
      context: {
        id: node.id,
        previous,
        next,
      },
    })
    createPage({
      path: node.fields.slug + 'changelog/',
      component: logTemplate,
      context: {
        title: node.frontmatter.title,
        changelog: log,
        relativePath,
      },
    })
  }

  // Extract tag data from query
  const tags = result.data.tagsGroup.group

  // Make tag pages
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })

  if (result.errors) {
    reporter.panic(result.errors)
  }
}

exports.onPostBuild = async ({ graphql, reporter, pathPrefix }) => {
  var queryResult = await graphql(`{
    site {
      siteMetadata {
        siteUrl
      }
    }
    postsQuery:allMarkdownRemark {
      edges {
        node {
          id
          fields{
            slug
          }
        }
      }
    }
    tagsQuery:allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
  }`)
  if (queryResult.errors) {
    reporter.panicOnBuild('Error while running GraphQL query to create sitemaps.', queryResult.errors)
  }
  queryResult = queryResult.data
  const siteURL = queryResult.site.siteMetadata.siteUrl
  CreateSitemap(
    path.resolve('./public/sitemap-articles.xml'),
    pathPrefix,
    siteURL,
    queryResult.postsQuery.edges,
    (data) => { return data.node.fields.slug },
  )
  CreateSitemap(
    path.resolve('./public/sitemap-logs.xml'),
    pathPrefix,
    siteURL,
    queryResult.postsQuery.edges,
    (data) => { return data.node.fields.slug + 'changelog/' },
  )
  CreateSitemap(
    path.resolve('./public/sitemap-tags.xml'),
    pathPrefix,
    siteURL,
    queryResult.tagsQuery.group,
    (data) => { return `/tags/${data.fieldValue}/` },
  )
  CreateSitemap(
    path.resolve('./public/sitemap-pages.xml'),
    pathPrefix,
    siteURL,
    ['/pages/', '/settings/'],
    (data) => { return data },
  )
  CreateIndexSitemap(
    path.resolve('./public/sitemap.xml'),
    pathPrefix,
    siteURL,
    ['sitemap-pages.xml', 'sitemap-articles.xml', 'sitemap-logs.xml', 'sitemap-tags.xml'],
  )
  CreateSitemapStylesheet(
    path.resolve('./public/sitemap.xsl'),
    pathPrefix,
    siteURL,
  )
}
