/**
 * Sidebar Content
 */
import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import IntlMessages from 'Util/IntlMessages';

import AgencySidebarMenuItem from './AgencySidebarMenuItem';

// redux actions
import { onToggleAgencyMenu } from 'Store/Actions';

function AgencySidebar(props) {
   const dispatch = useDispatch();
   const sidebar = useSelector(state => state.sidebar);
   const { agencySidebarMenu } = sidebar;

   const toggleMenu = (menu, stateCategory) => {
      let data = {
         menu,
         stateCategory
      }
      dispatch(onToggleAgencyMenu(data));
   }

   return (
      <div className="rct-sidebar-nav">
         <nav className="navigation">
            {agencySidebarMenu.category1 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={
                     <ListSubheader className="side-title" component="li">
                        <IntlMessages id="sidebar.general" />
                     </ListSubheader>}
               >
                  {agencySidebarMenu.category1.map((menu, key) => (
                     <AgencySidebarMenuItem
                        menu={menu}
                        key={key}
                        onToggleAgencyMenu={() => toggleMenu(menu, 'category1')}
                     />
                  ))}
               </List>
            }
            {agencySidebarMenu.category2 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.modules" /></ListSubheader>}
               >
                  {agencySidebarMenu.category2.map((menu, key) => (
                     <AgencySidebarMenuItem
                        menu={menu}
                        key={key}
                        onToggleAgencyMenu={() => toggleMenu(menu, 'category2')}
                     />
                  ))}
               </List>
            }
            {agencySidebarMenu.category3 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.component" /></ListSubheader>}
               >
                  {agencySidebarMenu.category3.map((menu, key) => (
                     <AgencySidebarMenuItem
                        menu={menu}
                        key={key}
                        onToggleAgencyMenu={() => toggleMenu(menu, 'category3')}
                     />
                  ))}
               </List>
            }
            {agencySidebarMenu.category4 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.features" /></ListSubheader>}
               >
                  {agencySidebarMenu.category4.map((menu, key) => (
                     <AgencySidebarMenuItem
                        menu={menu}
                        key={key}
                        onToggleAgencyMenu={() => toggleMenu(menu, 'category4')}
                     />
                  ))}
               </List>
            }
            {agencySidebarMenu.category5 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.applications" /></ListSubheader>}
               >
                  {agencySidebarMenu.category5.map((menu, key) => (
                     <AgencySidebarMenuItem
                        menu={menu}
                        key={key}
                        onToggleAgencyMenu={() => toggleMenu(menu, 'category5')}
                     />
                  ))}
               </List>
            }
            {agencySidebarMenu.category6 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.applications" /></ListSubheader>}
               >
                  {agencySidebarMenu.category6.map((menu, key) => (
                     <AgencySidebarMenuItem
                        menu={menu}
                        key={key}
                        onToggleAgencyMenu={() => toggleMenu(menu, 'category5')}
                     />
                  ))}
               </List>
            }
         </nav>
      </div>
   );
}

export default withRouter(AgencySidebar);
