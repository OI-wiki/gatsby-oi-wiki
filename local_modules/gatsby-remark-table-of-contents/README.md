# Table of Contents in Gatsby

[![Downloads][downloads-badge]][downloads]

[Gatsby][gatsby] plugin using [remark][remark] to generate a Table of Contents in markdown.


## Installation

```sh
npm i gatsby-remark-table-of-contents
```

## Options
### `exclude`

`string? | array?` — default: `''`  
Exclude titles matching this string (`new RegExp('^(' + string + ')$', 'i')`).
If an array is passed the array gets joined with a pipe (`new RegExp('^(' + array.join('|') + ')$', 'i')`).

### `tight`

`boolean?` — default: `false`  
Tight list items.


### `fromHeading`

`number?` — default: `2`  
Minimum heading depth to include.


### `toHeading`

`number?` — default: `6`  
Maximum heading depth to include.


## Use
Generate a table of contents:

````md
```toc
# This code block gets replaced with the TOC
```
````

If you like to overwrite the global settings in place (camelCase or kebab-case):

````md
```toc
# This code block gets replaced with the TOC
exclude: Table of Contents
tight: false,
from-heading: 2
to-heading: 6
```
````

## Global Configuration
Global configurations can be set in `gatsby-config.js`.

```js
module.exports = ({ root }) => ({
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-table-of-contents`,
            options: {
              exclude: "Table of Contents",
              tight: false,
              fromHeading: 1,
              toHeading: 6
            },
          }
        ],
      },
    },
  ],
})
```

## Example

### Input

````md
# Headlinge 1.0.0

## Table of Contents

```toc
exclude: Table of Contents
from-heading: 2
to-heading: 6
```

## Headline 1.1.0

### Headline 1.1.1

## Headline 1.2.0
````

### Output

````md
# Headlinge 1.0.0

## Table of Contents

-   [Headline 1.1.0](#headline-110)

    -   [Headline 1.1.1](#headline-111)

-   [Headline 1.2.0](#headline-120)

## Headline 1.1.0

### Headline 1.1.1

## Headline 1.2.0
````

## License

[MIT][license] – [Stefan Huber][author]

<!-- Definitions -->


[gatsby]: https://www.gatsbyjs.org/
[remark]: https://github.com/remarkjs/remark
[downloads]: https://www.npmjs.com/package/gatsby-remark-table-of-contents
[downloads-badge]: https://img.shields.io/npm/v/gatsby-remark-table-of-contents.svg
[license]: https://opensource.org/licenses/MIT
[author]: http://signalwerk.ch/


## Version

- **0.0.9** – ADD: Multiple excludes can now be defined by arrays
