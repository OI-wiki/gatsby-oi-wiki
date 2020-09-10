import React, { ReactElement } from 'react'

const Index = ():ReactElement => {
  if (typeof window !== 'undefined') {
    const target = JSON.parse(localStorage.getItem('language'))
    const redirection = target || '/zh/'
    window.location.replace(redirection)
  }
  return (<div>&apos;/&apos; redirect page</div>)
}
export default Index
