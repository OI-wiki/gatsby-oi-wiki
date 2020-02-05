/** @jsx jsx */
// import SEO from '../components/SEO'
import { Global } from '@emotion/core'
// import { Helmet } from 'react-helmet'
import { jsx } from 'theme-ui'
// import { css, jsx, Styled, useThemeUI } from 'theme-ui'
// import useSidebar from '../hooks/useSidebar'
import Footer from './Footer'
import Navbar from './Navbar'
// import ScreenReader from './ScreenReader'
// import Sidebar from './Sidebar'
// import SidebarToggler from './Sidebar/Toggler'
import AuthorsArray from './AuthorsArray'
import Tags from './Tags'
import Toc from './Toc'

function Layout({ children, location, authors, title, description, tags, toc}) {
  return (
    <div>
      <Global />
      <div>
        <Navbar />

        <main>
          {children}
        </main>

        <AuthorsArray authors={authors} />

        <Tags tags={tags} />

        <Footer />
      </div>
      <Toc toc={toc} />
  </div>
  )
}

export default Layout
