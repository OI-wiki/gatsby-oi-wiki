import FormatIndentDecreaseSharp from '@mui/icons-material/FormatIndentDecreaseSharp'
import FormatIndentIncreaseSharp from '@mui/icons-material/FormatIndentIncreaseSharp'
import React from 'react'
import { tocSidebarStore } from '../../stores/sidebarStore'
import { BTN_SIZE, ContainerBox, StyledIconBtn, WrapperBox } from '../NavSidebar'
import { observer } from 'mobx-react-lite'
import { headerStore } from '../../stores/headerStore'
import TocContainer, { TocContainerProps } from './TocContainer'

export type TocSidebarProps = TocContainerProps

const TocCollapseBtn = observer(() => {
  return (
    <StyledIconBtn
      aria-label="collapse toc sidebar"
      onClick={tocSidebarStore.toggleCollapsed}
      sx={{ left: -BTN_SIZE }}>
      {tocSidebarStore.collapsed
        ? <FormatIndentDecreaseSharp/>
        : <FormatIndentIncreaseSharp/>}
    </StyledIconBtn>
  )
})

const TocSidebar: React.FC<TocSidebarProps> = observer((props) => {
  const scaleX = tocSidebarStore.collapsed ? 0 : 1
  const translateX = tocSidebarStore.collapsed ? tocSidebarStore.width : 0

  return (
    <WrapperBox sx={{
      transform: `translate3d(${translateX}px, ${headerStore.currentHeight}px, 0)`,
      height: `calc(100vh - ${headerStore.currentHeight}px)`,
      borderRight: 'unset',
      right: 0,
    }}>
      <ContainerBox sx={{ transform: `scale3d(${scaleX}, 1, 1)` }}>
        <TocContainer toc={props.toc}/>
      </ContainerBox>
      <TocCollapseBtn/>
    </WrapperBox>
  )
})

export default TocSidebar
