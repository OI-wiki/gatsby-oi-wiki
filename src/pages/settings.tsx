import Grid from '@material-ui/core/Grid'
import React from 'react'
import Layout from '../components/Layout'
import createPersistedState from 'use-persisted-state'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import defaultSettings from '../lib/defaultSettings'
const useConfig = createPersistedState('settings')

function SettingsPage (props: {location: string}): unknown {
  const { location } = props
  const [settings, setSettings] = useConfig(defaultSettings)
  const updateSetting = (newSettings): void => (setSettings({ ...defaultSettings, ...newSettings }))
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Layout
      location={location}
      noMeta={'true'}
      noEdit={'true'}
      noToC={'true'}
      title={'设置'}
    >
      <Grid container spacing={2}>
        <Grid item>
          <FormControl>
            <InputLabel>夜间模式</InputLabel>
            <Select
              value={settings.darkMode.type}
              onChange={(e) => {
                updateSetting({
                  darkMode: {
                    type: e.target.value,
                  },
                })
              }}
            >
              <MenuItem value={'user-preference'}>跟随系统</MenuItem>
              <MenuItem value={'scheduled'}>定时开启</MenuItem>
              <MenuItem value={'always-on'}>总是打开</MenuItem>
              <MenuItem value={'always-off'}>总是关闭</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default SettingsPage
