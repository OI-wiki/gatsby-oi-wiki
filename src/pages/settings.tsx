import Grid from '@material-ui/core/Grid'
import React from 'react'
import createPersistedState from 'use-persisted-state'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core'
import { darken } from '@material-ui/core/styles/colorManipulator'
import Layout from '../components/Layout'
import defaultSettings from '../lib/defaultSettings'
import colors from '../styles/colors'

const useConfig = createPersistedState('settings')
type SettingsPageProps = {
  location: string
}
const SettingsPage: React.FC<SettingsPageProps> = (props: SettingsPageProps) => {
  const { location } = props
  const [settings, setSettings] = useConfig(defaultSettings)
  const updateSetting = (newSettings): void => {
    const finalSettings = { ...defaultSettings, ...settings, ...newSettings }
    setSettings(finalSettings)
    // eslint-disable-next-line dot-notation
    window !== undefined && window['onthemechange'](finalSettings)
  }
  type ColorButtonProp = { color: string, desc: string }
  const ColorButton: React.FC<ColorButtonProp> = (props: ColorButtonProp) => {
    const background = props.color === 'auto'
      ? undefined // inherit settings
      : props.color

    const useStyles = makeStyles((theme) => ({
      root: {
        background,
        color: theme.palette.getContrastText(background || theme.palette.background.default),
        margin: '1em 1.2em 1em 0',
        padding: 0,
        width: '8em',
        height: '8em',
        border: '.1em solid',
        borderColor: theme.palette.divider,
        '&:hover': {
          background: background ? darken(background, 0.2) : undefined,
        },
      },
      label: {
        margin: '0 .4em',
        lineHeight: '1.2em',
        textAlign: 'left',
        justifyContent: 'left',
        position: 'absolute',
        bottom: '.2em',
      },
    }))

    const classes = useStyles()
    return (
      <Grid item>
        <Button
          classes={classes}
          onClick={() => {
            updateSetting({
              theme: {
                navColor: props.color,
              },
            })
          }}
        >
          { props.desc }
        </Button>
      </Grid>
    )
  }

  return (
    <Layout
      location={location}
      noMeta="true"
      noEdit="true"
      noToC="true"
      title="设置"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <FormControl>
            <InputLabel>暗色模式</InputLabel>
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
              <MenuItem value="user-preference">跟随系统</MenuItem>
              <MenuItem value="always-on">总是打开</MenuItem>
              <MenuItem value="always-off">总是关闭</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          导航栏颜色
          <Grid container>
            {colors.map(props => (<ColorButton {...props} key={props.color}/>))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default SettingsPage
