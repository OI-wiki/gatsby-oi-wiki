import {
  Grid,
  Button,
  makeStyles,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
} from '@material-ui/core'
import {darken} from '@material-ui/core/styles/colorManipulator'
import React from 'react'
import Layout from '../components/Layout'
import colors from '../styles/colors'
import { useSetting, Settings } from '../lib/useSetting'

type Props = {
  background: any,
}
const useStyles = makeStyles((theme) => ({
  root: (props: Props) => ({
    background: props.background,
    color: theme.palette.getContrastText(props.background || theme.palette.background.default),
    margin: '1em 1.2em 1em 0',
    padding: 0,
    width: '8em',
    height: '8em',
    border: '.1em solid',
    borderColor: theme.palette.divider,
    '&:hover': {
      background: props.background ? darken(props.background, 0.2) : undefined,
    },
  }),
  label: {
    lineHeight: '1.2em',
    textAlign: 'left',
    justifyContent: 'left',
    position: 'absolute',
    bottom: '.4em',
    left: '.3em',
    width: 'calc(100% - .6em)'
  },
}))

type ColorButtonProp = {
  color: string,
  desc: string,
  onClick?: {(props: ColorButtonProp): any}
}
const ColorButton: React.FC<ColorButtonProp> = (props: ColorButtonProp) => {
  const background = props.color === 'auto'
    ? undefined // inherit settings
    : props.color

  const classes = useStyles({
    background: background,
  })
  return (
    <Grid item>
      <Button
        classes={classes}
        onClick={() => props.onClick(props)}
      >
        {props.desc}
      </Button>
    </Grid>
  )
}

type SettingsPageProps = {
  location: string
}
const SettingsPage: React.FC<SettingsPageProps> = (props: SettingsPageProps) => {
  const {location} = props
  const [settings, updateSetting] = useSetting()

  const onBtnClick = (cprops) => {
    updateSetting({
      theme: {
        navColor: cprops.color,
      },
    })
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
            暗色模式
            <RadioGroup
              name="theme-mode"
              value={settings.darkMode.type}
              onChange={(e) => {
                updateSetting({
                  darkMode: {
                    type: (e.target.value as unknown as ('user-preference' | 'always-on' | 'always-off')),
                  },
                })
              }}
            >
              <FormControlLabel value="user-preference" control={<Radio />} label="跟随系统" />
              <FormControlLabel value="always-on" control={<Radio />} label="总是打开" />
              <FormControlLabel value="always-off" control={<Radio />} label="总是关闭" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            动画
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={settings.animation.smoothScroll}
                    onChange={(e) => {
                      updateSetting({
                        animation: {
                          smoothScroll: e.target.checked
                        },
                      })
                    }
                    } name="gilad"
                  />
                }
                label="使用平滑滚动"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item>
          导航栏颜色
          <Grid container>
            {colors.map(props => (<ColorButton {...props} key={props.color} onClick={onBtnClick} />))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default SettingsPage
