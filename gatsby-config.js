module.exports = {
  siteMetadata: {
    title: 'OI Wiki',
    description: 'Guide for OI',
    author: 'OI Wiki Team',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-dox',
      options: {
        basePath: '/',
        contentPath: 'docs/',
        mdx: false 
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              // By default, `.md` is specified
              // ignoreFileExtensions: ['.md']
              // These files will not be copied
              ignoreFileExtensions: ['.md']
            }
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              isIconAfterHeader: true,
            }
          },
          {
            resolve: `gatsby-remark-table-of-contents`,
            options: {
              exclude: "Table of Contents",
              tight: true,
              every: true,
              fromHeading: 2,
              toHeading: 6
            }
          },
        ],
        remarkPlugins: [require("remark-math"), require("remark-details")],
        rehypePlugins: [require('rehype-mathjax'), require('rehype-details')],
        extensions: [".mdx", ".md"]
      }
    },
    `gatsby-plugin-catch-links`,
  ]
}
