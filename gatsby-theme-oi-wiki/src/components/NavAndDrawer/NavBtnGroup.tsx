import React from 'react'
import { IconButton, IconButtonProps, makeStyles, Tooltip } from '@material-ui/core'

import {
  GitHub as GitHubIcon,
  LibraryBooks as LibraryBooksIcon,
  LocalOffer as LocalOfferIcon,
  Settings as SettingsIcon,
  SvgIconComponent,
} from '@material-ui/icons'

const useStyles = makeStyles({
  navBtn: {
    padding: 0,
    margin: 12,
  },
})

interface NavBtnProps extends IconButtonProps<'a', React.AnchorHTMLAttributes<HTMLAnchorElement>> {
  title: string;
  Icon: SvgIconComponent;
}

const NavBtn: React.FC<NavBtnProps> = (props) => {
  const classes = useStyles()
  const { title, href, Icon, ...restProps } = props
  return <Tooltip title={title} placement="bottom" arrow>
    <IconButton component='a' href={href} className={classes.navBtn} {...restProps}>
      <Icon/>
    </IconButton>
  </Tooltip>
}

const OIWikiGithub = 'https://github.com/OI-wiki/OI-wiki'

const NavBtnGroup: React.FC = () => {
  return <>
    <NavBtn title="设置页" href="/settings" Icon={SettingsIcon}/>
    <NavBtn title="标签页" href="/tags" Icon={LocalOfferIcon}/>
    <NavBtn title="目录页" href="/pages" Icon={LibraryBooksIcon}/>
    <NavBtn
      title="GitHub 存储库"
      href={OIWikiGithub}
      Icon={GitHubIcon}
      target="_blank"
      rel="noreferrer noopener"
    />
  </>
}

export default NavBtnGroup
