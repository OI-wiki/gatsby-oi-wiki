import React from 'react'
import Layout from '../components/Layout'
import Title from '../components/Title'
import Typography from '@mui/material/Typography'


const NotFoundPage: React.FC = () => {
  return (
    <Layout withNav={false} withToc={false} title="404">
      <Title noEdit={true} relativePath="">404 is Found!</Title>
      <Typography>如果你是无意间来到这里的，请在下方告诉我们你是从哪里点进来的哦。</Typography>
    </Layout>
  )
}

export default NotFoundPage
