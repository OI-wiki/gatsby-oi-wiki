/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { graphql } from "gatsby"
import Checkbox from "@material-ui/core/Checkbox"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import Layout from "../components/Layout"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import parse from "autosuggest-highlight/parse"
import match from "autosuggest-highlight/match"
import Link from "../components/Link"
import Tags from "../components/Tags"
import CardActions from "@material-ui/core/CardActions"

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>
const checkedIcon = <CheckBoxIcon fontSize="small"/>
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
})

function pageItem(props) {
  const classes = useStyles()
  const {
    id,
    frontmatter: { title, tags },
    fields: { slug: link },
  } = props
  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
      <Card className={classes.root} variant={"outlined"}>
        <CardContent>
          <Typography variant="h5" component={Link} to={link}>
            {title}
          </Typography>
        </CardContent>
        <CardActions>
          <Tags tags={tags}/>
        </CardActions>
      </Card>
    </Grid>
  )
}

function BlogIndex(props) {
  const { location } = props
  const {
    data: {
      allMdx: {
        edges,
        group: tags,
      },
    },
  } = props
  const articles = edges.map(x => x.node)
  return (
    <Layout location={location} noMeta={"true"} noEdit={"true"} title={"目录页"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            onChange={(e) => {console.log(e.target)}}
            multiple
            options={tags}
            disableCloseOnSelect
            getOptionLabel={(option) => option.fieldValue}
            renderOption={(option, { inputValue, selected }) => {
              const matches = match(option.fieldValue, inputValue)
              const parts = parse(option.fieldValue, matches)
              return (
                <>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </>)
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="搜索标签..." placeholder="搜索标签..."/>
            )}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
      >
        {articles.map(x => pageItem(x))}
      </Grid>
    </Layout>
  )
}

// class BlogIndex extends React.Component {
//   data
//   location
//   children = []
//   posts
//   group
//
//   constructor(props) {
//     super(props)
//     this.state = {
//       selectedKeys: [],
//     }
//     this.data = props.data
//     this.location = props.location
//     const { edges: posts, group } = this.data.allMdx
//     this.posts = posts
//     this.group = group
//     this.group.forEach((tag) => {
//       this.children.push(<Option key={tag.fieldValue}>{tag.fieldValue}</Option>)
//     })
//   }
//
//   handleChange(value) {
//     this.setState({
//       selectedKeys: value,
//     })
//   }
//
//   render() {
//     return (
//       <Layout location={this.location} noMeta="true">
//         <Helmet title="目录页 - OI Wiki"/>
//         <h1>按标签筛选页面：</h1>
//         <Select
//           mode="multiple"
//           style={{ width: "100%" }}
//           placeholder="请选择，留空展示所有页面"
//           defaultValue={[]}
//           onChange={this.handleChange.bind(this)}
//         >
//           {this.children}
//         </Select>
//         <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
//           {this.posts.map(({ node: post }) => {
//             let allKeys = [...this.state.selectedKeys]
//             let isSelected
//             let tags = post.frontmatter.tags || []
//             if (allKeys === []) {
//               isSelected = true
//             } else {
//               isSelected = allKeys
//                 .map((x) =>
//                   tags.reduce((prev, curr) => prev || curr === x, false),
//                 )
//                 .reduce((prev, curr) => prev && curr, true)
//             }
//             if (!isSelected) return <div key={post.id}/>
//             else
//               return (
//                 <Col
//                   xs={24}
//                   sm={12}
//                   md={12}
//                   lg={8}
//                   xl={8}
//                   xxl={4}
//                   key={post.id}
//                 >
//                   <Card
//                     title={
//                       <a
//                         href={post.fields.slug}
//                         sx={{
//                           ":hover": {
//                             color: "#1E90FF",
//                             textDecoration: "none",
//                           },
//                           color: "black",
//                         }}
//                       >
//                         {" "}
//                         {post.frontmatter.title || "本页面没有标题"}{" "}
//                       </a>
//                     }
//                     bordered={true}
//                   >
//                     <Tags tags={tags}/>
//                   </Card>
//                 </Col>
//               )
//           })}
//         </Row>
//       </Layout>
//     )
//   }
// }

export const pageQuery = graphql`
  query blogIndex {
    allMdx {
      edges {
        node {
          id
          frontmatter {
            title
            tags
          }
          fields {
            slug
          }
        }
      }
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
export default BlogIndex
