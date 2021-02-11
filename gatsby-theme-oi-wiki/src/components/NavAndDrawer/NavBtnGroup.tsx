import React from 'react'
import {Tooltip, IconButton, makeStyles} from "@material-ui/core"

import {
  LibraryBooks as LibraryBooksIcon,
  LocalOffer as LocalOfferIcon,
  GitHub as GitHubIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons'

const useStyles = makeStyles({
  navBtn: {
    padding: 0,
    margin: 12,
  },
})

function NavBtn({title, href, Icon, ...restProps}) {
  const classes = useStyles()
  return (
    <Tooltip title={title} placement="bottom" arrow>
      <IconButton component="a" href={href} color="inherit" className={classes.navBtn} {...restProps}>
        <Icon />
      </IconButton>
    </Tooltip>
  )
}

const OIWikiGithub = 'https://github.com/OI-wiki/OI-wiki'

export default function NavBtnGroup() {
  return (
    <>
      <NavBtn title="设置页" href="/settings" Icon={SettingsIcon} />
      <NavBtn title="标签页" href="/tags" Icon={LocalOfferIcon} />
      <NavBtn title="目录页" href="/pages" Icon={LibraryBooksIcon} />
      <NavBtn
        title="GitHub 存储库"
        href={OIWikiGithub}
        Icon={GitHubIcon}
        target="_blank"
        rel="noreferrer noopener"
      />
    </>
  )
}