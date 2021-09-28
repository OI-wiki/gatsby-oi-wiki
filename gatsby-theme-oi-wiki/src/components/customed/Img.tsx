import React from 'react'
import styled from '@mui/material/styles/styled'

const StyledImg = styled('img')`
  max-width: 100%;
  margin: 0 auto;
  filter: var(--image-filter);
`

const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return <StyledImg {...props}/>
}

export default Img
