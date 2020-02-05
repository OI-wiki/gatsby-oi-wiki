/** @jsx jsx */
import { jsx } from 'theme-ui'
import navbarData from '../navbar.yaml'
// import ColorModeButton from './ColorModeButton'
import Link from './Link'

function Navbar() {
  return (
    <nav aria-label="Navbar Menu">
      <div sx={{ variant: 'layout.container', textAlign: 'right' }}>
        <ul sx={{ listStyle: 'none', m: 0, ml: 'auto', p: 0 }}>
          {navbarData.items.map(item => (
            <li key={item.link} sx={{ ml: 3, display: 'inline-block' }}>
              <Link to={item.link} sx={{ variant: 'linkStyles.nav' }}>
                {item.title}
              </Link>
            </li>
          ))}
          <li sx={{ display: 'inline-block' }}>
            {/* <ColorModeButton /> */}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
