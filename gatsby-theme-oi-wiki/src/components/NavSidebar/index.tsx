import { css } from '@emotion/react'
import styled from '@mui/material/styles/styled'
import List from '@mui/material/List'
import React from 'react'
import Box from '@mui/material/Box'
import { headerStore } from '../../stores/headerStore'
import { navSidebarStore } from '../../stores/sidebarStore'
import { observer } from 'mobx-react-lite'
import IconButton from '@mui/material/IconButton'
import FormatIndentDecreaseSharp from '@mui/icons-material/FormatIndentDecreaseSharp'
import FormatIndentIncreaseSharp from '@mui/icons-material/FormatIndentIncreaseSharp'
import pathList from '../../sidebar.yaml'
import scrollbarStyle from '../../theme/scrollbarStyle'
import { NavSidebarProps } from './types'
import { getTypedPathList } from './utils'
import listItemBuilder from './listItemBuilder'

const StyledList = styled(List)`
  width: 100%;
  height: 100%;
`

const WrapperBox = styled(Box)(({ theme }) => css`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  width: auto;
  transition: transform 225ms ease-in-out;
  border-inline: 1px solid ${theme.palette.divider};
  flex-shrink: 0;
  z-index: 1;
`)

const ContainerBox = styled(Box)`
  ${scrollbarStyle};
  --scrollbar-size: 0.33rem;

  position: relative;
  height: inherit;
  width: ${navSidebarStore.width}px;
  transition: transform 225ms ease-in-out;
`


const ICON_SIZE = 40
const BTN_SIZE = ICON_SIZE + 20

const StyledIconBtn = styled(IconButton)`
  position: absolute;
  top: 0;
  width: ${BTN_SIZE}px;
  height: ${BTN_SIZE}px;

  opacity: 0.2;
  transition: opacity 225ms;

  &:hover {
    opacity: 1;
  }
`

const NavCollapseBtn = observer(() => {
  return (
    <StyledIconBtn
      aria-label="collapse nav sidebar"
      onClick={navSidebarStore.toggleCollapsed}
      sx={{ right: -BTN_SIZE }}>
      {navSidebarStore.collapsed
        ? <FormatIndentDecreaseSharp/>
        : <FormatIndentIncreaseSharp/>
      }
    </StyledIconBtn>
  )
})

const NavSidebar: React.FC<NavSidebarProps> = observer((props) => {
  const { pathname } = props
  const scaleX = navSidebarStore.collapsed ? 0 : 1
  const translateX = navSidebarStore.collapsed ? -navSidebarStore.width : 0
  const navList = React.useMemo(
    () => getTypedPathList(pathList)
      .map((item) => listItemBuilder(item, 16, pathname))
      .map(([x]) => x),
    [pathname],
  )

  return (
    <WrapperBox
      sx={{
        transform: `translate3d(${translateX}px, ${headerStore.currentHeight}px, 0)`,
        height: `calc(100vh - ${headerStore.currentHeight}px)`,
        borderLeft: 'unset',
      }}
    >
      <ContainerBox sx={{ transform: `scale3d(${scaleX}, 1, 1)` }}>
        <StyledList>
          {navList}
        </StyledList>
      </ContainerBox>
      <NavCollapseBtn/>
    </WrapperBox>
  )
})

export default NavSidebar
export { BTN_SIZE, ContainerBox, ICON_SIZE, StyledIconBtn, WrapperBox }
