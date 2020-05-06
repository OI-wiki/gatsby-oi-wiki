import Grid from '@material-ui/core/Grid'
// @ts-ignore
import React from 'react'
import Layout from '../components/Layout'
// import useLocalStorage from "../lib/useLocalstorage"

function SettingsPage (props: {location: string}) {
  const { location } = props
  // const [settings, setSettings] = useLocalStorage('settings')
  return (
    // @ts-ignore
    <Layout
      location={location}
      noMeta={'true'}
      noEdit={'true'}
      noToC={'true'}
      title={'设置'}
    >
      <Grid container spacing={2}>

      </Grid>
    </Layout>
  )
}

export default SettingsPage
