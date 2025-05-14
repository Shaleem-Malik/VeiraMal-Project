/**
 * Sidebar Content
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import NavMenuItem from './NavMenuItem';
// redux actions
import { onToggleMenu } from 'Store/Actions';

function SidebarContent(){
   const dispatch = useDispatch();
   const sidebar = useSelector(state => state.sidebar);
   const { sidebarMenus } = sidebar;

	const toggleMenu = (menu, stateCategory) => {
		let data = { menu, stateCategory }
		dispatch(onToggleMenu(data));
	}
  
   return (
      <div className="rct-sidebar-nav">
         <nav className="navigation">
            <List
               className="rct-mainMenu p-0 m-0 list-unstyled"
               subheader={
                  <ListSubheader className="side-title" component="li">
                     <IntlMessages id="sidebar.general" />
                  </ListSubheader>}
            >
               {sidebarMenus.category1 && sidebarMenus.category1.map((menu, key) => (
                  <NavMenuItem
                     menu={menu}
                     key={key}
                     onToggleMenu={() => toggleMenu(menu, 'category1')}
                  />
               ))}
            </List>
            {sidebarMenus.category2 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.modules" /></ListSubheader>}
               >
                  { sidebarMenus.category2.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category2')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category3 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.component" /></ListSubheader>}
               >
                  { sidebarMenus.category3.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category3')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category4 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.features" /></ListSubheader>}
               >
                  {sidebarMenus.category4 && sidebarMenus.category4.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category4')}
                     />
                  ))}
               </List>
            }  
            {sidebarMenus.category5 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.applications" /></ListSubheader>}
               >
                  {sidebarMenus.category5 && sidebarMenus.category5.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category5')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category6 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.extensions" /></ListSubheader>}
               >
                  {sidebarMenus.category6 && sidebarMenus.category6.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category6')}
                     />
                  ))}
               </List>
            }
         </nav>
      </div>
   );
}

export default withRouter(SidebarContent);
