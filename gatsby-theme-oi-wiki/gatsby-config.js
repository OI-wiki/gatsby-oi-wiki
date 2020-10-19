const path = require('path')

const isProd = process.env.PRODUCTION === 'true' || process.env.RENDER === 'true'
const condition = (cond, v) => cond ? [v] : []
if (isProd && process.env.gatsby_executing_command !== 'build') {
  console.warn('Using production configurations in non-build environment')
}
if (!isProd && process.env.CI === 'true') {
  console.warn('Using development configurations in build environment')
}

const mathRehype = process.env.gatsby_executing_command === 'build'
  ? [require('rehype-mathjax/chtml'),
    { fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/output/chtml/fonts/woff-v2' }]
  : [require('rehype-mathjax/browser')]

module.exports = {
  siteMetadata: {
    title: 'OI Wiki',
    description: 'Guide for OI',
    author: 'OI Wiki Team',
    siteUrl: 'https://ng.oi-wiki.org',
  },
  plugins: [
    'gatsby-source-local-git',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: './docs/',
        path: path.resolve('./docs/'),
      },
    },
    ...condition(isProd, 'gatsby-plugin-sharp'),
    ...condition(isProd, 'gatsby-transformer-sharp'),
    {
      resolve: 'gatsby-transformer-remark-rehype',
      options: {
        plugins: [
          ...condition(isProd, {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 900,
              withWebp: true,
              tracedSVG: false,
              linkImagesToOriginal: false,
              disableBgImageOnAlpha: true,
            },
          }),
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              // By default, `.md` is specified
              // ignoreFileExtensions: ['.md']
              // These files will not be copied
              ignoreFileExtensions: ['.md'],
            },
          },
          /** {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              isIconAfterHeader: true,
            },
          }, */
          {
            resolve: 'gatsby-local-autolink-headers',
            options: {
              isIconAfterHeader: true,
            },
          },
        ],
        remarkPlugins: [require('remark-math'), require('remark-details'), [require('@mgtd/remark-shiki'), { semantic: false, theme: 'dark_plus', skipInline: true }]],
        rehypePlugins: [
          require('rehype-details'),
          require('./plugins/rehype-pseudocodejs'),
          mathRehype,
        ],
        extensions: ['.mdx', '.md'],
      },
    },
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    ...condition(isProd, {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'OI Wiki',
        short_name: 'OI Wiki',
        start_url: '/',
        display: 'standalone',
        icon: require.resolve('./icon/favicon_512x512.png'),
      },
    }),
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        precachePages: [],
        workboxConfig: {
          importWorkboxFrom: 'local',
          globPatterns: ['page-data/**', '*.js'],
          runtimeCaching: [
            {
              urlPattern: /(\.js$|\.css$)/, // js and css
              handler: 'CacheFirst',
            },
            {
              urlPattern: /^https?:.*\.(json)$/, // page-data
              handler: 'NetworkFirst',
            },
            {
              urlPattern: /^https?:.*\.(woff|woff2)$/, // mathjax fonts
              handler: 'StaleWhileRevalidate',
            },
            {
              urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff)$/, // do not cache images
              handler: 'NetworkOnly',
            },
          ],
          skipWaiting: true,
          clientsClaim: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-advanced-sitemap',
      options: {
        // 1 query for each data type
        query: `
        {
          allMarkdownRemark {
            edges {
              node {
                id
                fields{
                  slug
                }
              }
            }
          }
        }`,
        mapping: {
          // Each data type can be mapped to a predefined sitemap
          // Routes can be grouped in one of: posts, tags, authors, pages, or a custom name
          // The default sitemap - if none is passed - will be pages
          allMarkdownRemark: {
            sitemap: 'documents',
          },
        },
        exclude: [
          '/dev-404-page/',
          '/404.tsx/',
          '/404.html',
          '/offline-plugin-app-shell-fallback/',
          //          `/(\/)?hash-\S*/`, // you can also pass valid RegExp to exclude internal tags for example
        ],
        createLinkInHead: true, // optional: create a link in the `<head>` of your site
        addUncaughtPages: true, // optional: will fill up pages that are not caught by queries and mapping and list them under `sitemap-pages.xml`
      },
    },
    // 'gatsby-plugin-preact',
    // "gatsby-plugin-webpack-bundle-analyser-v2",
    // when you need to analyze bundle size, enable it
  ],
}
