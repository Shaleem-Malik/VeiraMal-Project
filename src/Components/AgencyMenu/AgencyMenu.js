/**
 * Agency Menu
 */
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import { withRouter } from 'react-router-dom';

//Intl Meassages
import IntlMessages from 'Util/IntlMessages';

import navLinks from './NavLinks';
import NavMenuItem from './NavMenuItem';
import Sidebar from 'Components/Sidebar';

//Component
import SearchForm from 'Components/Header/SearchForm';
import MobileSearchForm from 'Components/Header/MobileSearchForm';

function AgencyMenu(){
   const [isMobileSearchFormVisible, setIsMobileSearchFormVisible] = useState(false);
   const [mobileMenu, setMobileMenu] = useState(false);
	
	// mobile search form
	const openMobileSearchForm = () => {
      setIsMobileSearchFormVisible(true)
	}

   return (
      <div className="horizontal-menu agency-menu justify-content-between align-items-center">
         <ul className="list-unstyled nav">
            {navLinks.category1 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-view-dashboard"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.general" /></span>
                     <span className="arrow-icon"></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks.category1.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks.category2 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-widgets"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.modules" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks.category2.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks.category3 && 
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-view-carousel"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.component" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks.category3.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks.category4 && 
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-wrench"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.features" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks.category4.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks.category5 && 
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-assignment-check"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.applications" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks.category5.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks.category5 && 
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-assignment-check"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.extensions" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks.category6.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
         </ul>
         <IconButton className="hamburger-icon" color="inherit" aria-label="Menu" onClick={() => setMobileMenu(true)}>
            <MenuIcon />
         </IconButton>
         <div className="search-icon">
            <SearchForm />
            <IconButton mini="true" className="search-icon-btn" onClick={openMobileSearchForm}>
               <i className="zmdi zmdi-search"></i>
            </IconButton>
            <MobileSearchForm
               isOpen={isMobileSearchFormVisible}
               onClose={() => setIsMobileSearchFormVisible(false)}
            />
            <Drawer open={mobileMenu} onClose={() => setMobileMenu(false)}>
               <Sidebar agencySidebar />
            </Drawer>
         </div>
      </div>
   );
}
export default withRouter(AgencyMenu);