# Dox - Gatsby Theme

A Gatsby theme for creating documentation site.

Documentation made easy with Gatsby. :tada:

## Features

- :open_book: MDX support
- :nail_care: Theme UI support
- :art: Syntax Highlighting
- :bookmark_tabs: Navbar, Sidebar & Footer
- :iphone: Fully Responsive Design :computer:

## Installation

Install the `gatsby-theme-dox` package:

```sh
# with npm:
npm run --save gatsby-theme-dox

# with yarn:
yarn add gatsby-theme-dox
```

## Usage

Add the `gatsby-theme-dox` pacakge in your `gatsby-config.js` file:

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    title: `Dox - Gatsby Theme`,
    description: 'Documentation made easy with Gatsby',
    author: 'MunifTanjim'
  },
  plugins: [`gatsby-theme-dox`]
}
```

You can also pass a `options` object if you want:

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-dox',
      options: {
        basePath: '/',
        contentPath: 'docs'
      }
    }
  ]
}
```

## Theme Options

| Key           | Default value  | Description                                                                          |
| ------------- | -------------- | ------------------------------------------------------------------------------------ |
| `basePath`    | `/`            | Root URL for the documentation site                                                  |
| `contentPath` | `content/docs` | Location of documentation files                                                      |
| `mdx`         | `true`         | Configure `gatsby-plugin-mdx` plugin (if your site already is using it, set `false`) |
