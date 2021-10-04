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

type NavBtnProps = IconButtonProps<typeof Link> &
  IconButtonProps<'a'> & {
    title: string
    to: string
    Icon: SvgIconComponent
  }

function isRelativeLink(link: string): boolean {
  return link.startsWith('.') || link.startsWith('/')
}

const NavBtn: React.FC<NavBtnProps> = props => {
  const classes = useStyles()
  const { title, to, Icon, ...restProps } = props
  return (
    <Tooltip title={title} placement="bottom" arrow>
      <IconButton
        {...restProps}
        component={isRelativeLink(to) ? Link : 'a'}
        href={to}
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

const NavBtnGroup: React.FC = () => {
  return (
    <>
      <NavBtn title="设置页" to="/settings" Icon={SettingsIcon} />
      <NavBtn title="标签页" to="/tags" Icon={LocalOfferIcon} />
      <NavBtn title="目录页" to="/pages" Icon={LibraryBooksIcon} />
      <NavBtn title="运行工具" to="/play" Icon={CodeIcon} />
      <NavBtn title="GitHub 存储库" to={OIWikiGithub} Icon={GitHubIcon} target="_blank" rel="noreferrer noopener" />
    </>
  )
}

export default NavBtnGroup
