/**
 * App Header
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Drawer, AppBar, Toolbar, Tooltip }from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import screenfull from 'screenfull';
import MenuIcon from '@material-ui/icons/Menu';
// actions
import { collapsedSidebarAction } from 'Store/Actions';
import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';

function Header(props){
   const [customizer, setCustomizer] = useState(false);

   const dispatch = useDispatch();
   const settings = useSelector(state => state.settings);
   
	// function to change the state of collapsed sidebar
	const onToggleNavCollapsed = (event) => {
      const val = settings.navCollapsed ? false : true;
		dispatch(collapsedSidebarAction(val));
	}
	
	// close dashboard overlay
	const closeDashboardOverlay = () => {
		var e = document.getElementsByClassName('dashboard-overlay')[0];
		e.classList.remove('show');
		e.classList.add('d-none');
		document.body.style.overflow = "";
	}

	// toggle screen full
	const toggleScreenFull = () => {
		screenfull.toggle();
	}
   
   const { horizontalMenu, agencyMenu } = props;
   return (
      <AppBar position="static" className="rct-header">
         <Toolbar className="d-flex justify-content-between w-100 pl-0">
            <div className="d-inline-flex align-items-center">
               {(horizontalMenu || agencyMenu) &&
                  <div className="site-logo">
                     <Link to="/" className="logo-mini">
                     <img src={`${process.env.PUBLIC_URL}/assets/images/img/appLogo.png`} className="mr-15" alt="site logo" width="35" height="35" />
                     </Link>
                     <Link to="/" className="logo-normal">
                     <img src={`${process.env.PUBLIC_URL}/assets/images/img/appLogoText.png`} className="img-fluid" alt="site-logo" width="67" height="17" />
                     </Link>
                  </div>
               }
               {!agencyMenu &&
                  <ul className="list-inline mb-0 navbar-left">
                     {!horizontalMenu ?
                        <li className="list-inline-item" onClick={(e) => onToggleNavCollapsed(e)}>
                           <Tooltip title="Sidebar Toggle" placement="bottom">
                              <IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
                                 <MenuIcon />
                              </IconButton>
                           </Tooltip>
                        </li> :
                        <li className="list-inline-item">
                           <Tooltip title="Sidebar Toggle" placement="bottom">
                              <IconButton color="inherit" aria-label="Menu" className="humburger p-0" component={Link} to="/">
                                 <i className="ti-layout-sidebar-left"></i>
                              </IconButton>
                           </Tooltip>
                        </li>
                     }
                  </ul>
               }
            </div>
            <ul className="navbar-right list-inline mb-0">
               <li className="list-inline-item">
                  <Tooltip title="Full Screen" placement="bottom">
                     <IconButton aria-label="settings" onClick={() => toggleScreenFull()}>
                        <i className="zmdi zmdi-crop-free"></i>
                     </IconButton>
                  </Tooltip>
               </li>
            </ul>
            <Drawer
               anchor={'right'}
               open={customizer}
               onClose={() => setCustomizer(false)}
            >
               <ChatSidebar />
            </Drawer>
         </Toolbar>
         <DashboardOverlay
            onClose={() => closeDashboardOverlay()}
         />
      </AppBar>
   );
}

export default withRouter(Header);
