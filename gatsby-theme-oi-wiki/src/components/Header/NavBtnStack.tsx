import React from 'react'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { Link } from 'gatsby'
import { Code, GitHub, LibraryBooks, LocalOffer, Settings } from '@mui/icons-material'


interface NavBtnProps {
  title: string;
  Icon: typeof SvgIcon;
  to: string;
}

function isRelativeLink(link: string): boolean {
  return link.startsWith('.') || link.startsWith('/')
}

const NavBtn: React.FC<NavBtnProps> = (props) => {
  const { title, Icon, to } = props

  return (
    <Tooltip title={title}>
      <IconButton
        color="inherit"
        {...isRelativeLink(to) ? {
          component: Link,
          to,
        } : {
          component: 'a',
          href: to,
          target: '_blank',
          rel: 'noopener noreferrer',
        }}
      >
        <Icon/>
      </IconButton>
    </Tooltip>
  )
}

const OI_WIKI_GH_LINK = 'https://github.com/OI-wiki/OI-wiki'

const NavBtnStack: React.FC = () => {
  return (
    <Stack direction="row" alignItems="center">
      <NavBtn title="设置页" Icon={Settings} to="/settings"/>
      <NavBtn title="标签页" Icon={LocalOffer} to="/tags"/>
      <NavBtn title="目录页" Icon={LibraryBooks} to="/pages"/>
      <NavBtn title="运行工具" Icon={Code} to="/play"/>
      <NavBtn title="GitHub 存储库" Icon={GitHub} to={OI_WIKI_GH_LINK}/>
    </Stack>
  )
}

const NavBtnStackMemo = React.memo(NavBtnStack, () => true)

export default NavBtnStackMemo
