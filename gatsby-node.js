const path = require('path')
const crypto = require('crypto')
const _ = require('lodash')
const git = require('simple-git')
const { createFilePath } = require('gatsby-source-filesystem')

const gitQuery = async function (prop) {
  // +index.md or - / + .md
  const particalPath = prop.split('/').length > 3 ? (prop.slice(0, -1) + '.md') : (prop + 'index.md')
  const completePath = 'docs' + particalPath
  const res = await git().log(['--', completePath])
  // lack error handle and console data
  // console.log(res)
  return res
}
exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField, createNode } = actions
  // you only want to operate on `Mdx` nodes. If you had content from a
  // remote CMS you could also check to see if the parent node was a
  // `File` node here
  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode })
    const log = await gitQuery(value)
    log.all.slice(0, 15).map((item, index) => {
      const { hash, date, message, refs, body, author_name: name, author_email: email } = item
      createNode({
        author: name,
        date,
        message,
        hash,
        refs,
        body,
        email,
        id: hash + index,
        parent: null,
        filepath: value,
        internal: {
          type: 'ChangeLog',
          contentDigest: crypto
            .createHash('md5')
            .update(JSON.stringify(name))
            .digest('hex'),
        },
      })
    })
    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix. you
      // don't need a separating "/" before the value because
      // createFilePath returns a path with the leading "/".
      value: `${value}`,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const docTemplate = path.resolve('src/templates/doc.js')
  const tagTemplate = path.resolve('src/templates/tags.js')
  const logTemplate = path.resolve('src/templates/changelog.js')

  const result = await graphql(`
    {
      postsRemark: allMdx(
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
            }
          }
        }
      }
      tagsGroup: allMdx(limit: 2000) {
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
  posts.forEach(({ node }, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1]
    const next = index === 0 ? null : posts[index - 1]
    // const log = await gitQuery(node.fields.slug)
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
        slug: node.fields.slug,
      },
    })
  })

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
