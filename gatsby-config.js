module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-dox',
      options: {
        basePath: '/',
        contentPath: 'docs/**/*',
        mdx: false 
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [],
        remarkPlugins: [require("remark-math"), require("remark-details")],
        rehypePlugins: [require('rehype-mathjax'), require('rehype-details')],
        extensions: [".mdx", ".md"]
      }
    },
  ]
}
