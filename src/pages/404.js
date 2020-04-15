// Components
import React from 'react'
import Layout from '../components/Layout'

const page = (location) => (
  <Layout location={location} noEdit="true" title="404 Not Found">
    <div>
      <div>
        <h1>没有找到这个页面</h1>
        <p>如果你是无意间来到这里的，请告诉我们你是从哪里来的哦。</p>
      </div>
    </div>
  </Layout>
)

export default page
