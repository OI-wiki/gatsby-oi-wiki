import SmartLink, { SmartLinkProps } from '../SmartLink'
import React from 'react'

interface DefaultProps extends SmartLinkProps {
  isIndex: boolean;
  pathname: string;
}

const Link: (defaultProps: DefaultProps) => React.FC<SmartLinkProps> = (defaultProps) => {
  return function Link(props) {
    return <SmartLink tooltip={true} {...defaultProps} {...props}/>
  }
}
export default Link
