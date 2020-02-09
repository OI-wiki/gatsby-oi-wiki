/** @jsx jsx */
import { jsx } from 'theme-ui'
import navbarData from '../navbar.yaml'
// import ColorModeButton from './ColorModeButton'
import Link from './Link'
import { MdSchool } from "react-icons/md";
import Search from 'antd/lib/input/Search';
import theme from '../theme'

function Navbar() {
  return (
    <nav aria-label="Navbar Menu" sx={{
      'box-shadow': '0 0 0.2rem rgba(0,0,0,.1), 0 0.2rem 0.4rem rgba(0,0,0,.2)',
      width: '100%',
    }}>
      <div 
        sx={{
          color: 'black',
        }}
        className='nav-firstrow'
      >
        <ul sx={theme.layout.navbar.navList}>
            <Link to="/"  sx={{
              float: 'left',
              fontSize: 'large', 
              color: 'black',
          }}>
                <MdSchool className="logo" size={48} sx={{paddingTop: '0.5rem', paddingRight: '0.5rem'}}>
          </MdSchool>
          </Link>
            <span>OI Wiki</span>
            <div sx={{float: 'right'}}>
            <Search
      placeholder="键入进行搜索"
      onSearch={value => console.log(value)}
      style={{ width: 200 }}
    />
          {navbarData.items.map(item => (
            <li key={item.link} sx={{ ml: 3, display: 'inline-block' }}>
              <Link 
                to={item.link}
                sx={{ 
                    variant: 'linkStyles.nav',
                    padding: '0rem 0.5rem'
                }}
              >
                {item.title}
              </Link>
            </li>
          ))}
          </div>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
