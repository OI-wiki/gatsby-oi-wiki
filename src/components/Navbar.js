/** @jsx jsx */
import { jsx } from 'theme-ui'
import navbarData from '../navbar.yaml'
// import ColorModeButton from './ColorModeButton'
import Link from './Link'
import { MdSchool } from "react-icons/md";
import Search from 'antd/lib/input/Search';

function Navbar() {
  return (
    <nav aria-label="Navbar Menu">
      <div 
        sx={{
          color: 'black',
        }}
        className='nav-firstrow'
      >
        <ul sx={{ listStyle: 'none', m: 0, ml: 'auto', p: 0}}>
            <Link to="/"  sx={{
              float: 'left',
              fontSize: 'large', 
              color: 'black',
          }}>
                <MdSchool className="logo" size={48} sx={{paddingTop: '0.5rem'}}>
          </MdSchool>
          </Link>
            <span>OI Wiki</span>
            <div sx={{float: 'right'}}>

            {/* <Search
      placeholder="input search text"
      enterButton="Search"
      size="medium"
      onSearch={value => console.log(value)}
      sx={{display: 'inline-block'}}
    /> */}
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
      <div sx={{
          textAlign: 'right',
          color: 'black'
        }}
        className="nav-secondrow"
      >

      </div>
    </nav>
  )
}

export default Navbar
