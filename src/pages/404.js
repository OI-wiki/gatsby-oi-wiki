import PropTypes from "prop-types"

// Components
import { Helmet } from "react-helmet"
import React from 'react'
import Layout from '../components/layout'

const page = (location) => (
  <Layout location={location}>
  <div>
    <Helmet title={`404 Page`} />
    <div>
      <h1>404 is Found</h1>
      <p>
        你是从哪里点进来的呢？
      </p>
    </div>
  </div>
  </Layout>
)


export default page
