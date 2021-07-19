import type { IconButtonProps } from '@material-ui/core'
import { IconButton, makeStyles, Tooltip } from '@material-ui/core'
import type { SvgIconComponent } from '@material-ui/icons'
import {
  Code as CodeIcon,
  GitHub as GitHubIcon,
  LibraryBooks as LibraryBooksIcon,
  LocalOffer as LocalOfferIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons'
import { Link } from 'gatsby'
import React from 'react'

const useStyles = makeStyles({
  navBtn: {
    padding: 0,
    margin: 12,
  },
})

type NavBtnProps = IconButtonProps<typeof Link> & {
  title: string
  to: string
  Icon: SvgIconComponent
}

function NavBtn ({
  title,
  to,
  Icon,
  ...restProps
}: NavBtnProps): React.ReactElement {
  const classes = useStyles()
  return (
    <Tooltip title={title} placement="bottom" arrow>
      <IconButton
        {...restProps}
        component={Link}
        to={to}
        color="inherit"
        className={classes.navBtn}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  )
}

const OIWikiGithub = 'https://github.com/OI-wiki/OI-wiki'

export default function NavBtnGroup (): React.ReactElement {
  return (
    <>
      <NavBtn title="设置页" to="/settings" Icon={SettingsIcon} />
      <NavBtn title="标签页" to="/tags" Icon={LocalOfferIcon} />
      <NavBtn title="目录页" to="/pages" Icon={LibraryBooksIcon} />
      <NavBtn title="运行工具" to="/play" Icon={CodeIcon} />
      <NavBtn
        title="GitHub 存储库"
        to={OIWikiGithub}
        Icon={GitHubIcon}
        target="_blank"
        rel="noreferrer noopener"
      />
    </>
  )
}
