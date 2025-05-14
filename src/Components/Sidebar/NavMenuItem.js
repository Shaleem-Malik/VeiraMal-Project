/**
 * Nav Menu Item
 */
import React, { Fragment, useState } from 'react';
import { List, ListItem, ListItemIcon, Collapse, Chip } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

// intl messages
import IntlMessages from 'Util/IntlMessages';

function NavMenuItem(props){
   const [subMenuOpen, setSubMenuOpen] = useState('');
   const { menu, onToggleMenu } = props;

   /**
   * On Toggle Collapse Menu
   */
   const onToggleCollapseMenu = (index) => {
      if (subMenuOpen === '') {
         setSubMenuOpen(index);
      }
      else if (subMenuOpen !== index) {
         setSubMenuOpen(index);
      }
      else {
         setSubMenuOpen('');
      }
   }
   
   if (menu.child_routes != null) {
      return (
         <Fragment>
            <ListItem button component="li" onClick={onToggleMenu} className={`list-item ${classNames({ 'item-active': menu.open })}`}>
               <ListItemIcon className="menu-icon">
                  <i className={menu.menu_icon}></i>
               </ListItemIcon>
               <span className="menu text-capitalize">
                  <IntlMessages id={menu.menu_title} />
               </span>
               {menu.new_item && menu.new_item === true ?
                  <Chip label="new" className="new-item" color="secondary" />
                  :
                  ''
               }
            </ListItem>
            <Collapse in={menu.open} timeout="auto" className="sub-menu">
               <Fragment>
                  {menu.type_multi == null ?
                     <List className="list-unstyled py-0">
                        {menu.child_routes.map((subMenu, index) => {
                           return (
                              <ListItem button component="li" key={index}>
                                 <NavLink to={subMenu.path} activeClassName="item-active" >
                                    <span className="menu">
                                       <IntlMessages id={subMenu.menu_title} />

                                    </span>
                                    {subMenu.new_item && subMenu.new_item === true ?
                                       <Chip label="new" className="new-item" color="secondary" />
                                       :
                                       ''
                                    }
                                 </NavLink>
                              </ListItem>
                           )
                        })}
                     </List>
                     :
                     <List className="list-unstyled py-0">
                        {menu.child_routes.map((subMenu, index) => {
                           return (
                              <Fragment key={index}>
                                 <ListItem button component="li"
                                    onClick={() => onToggleCollapseMenu(index)}
                                    className={`list-item ${classNames({ 'item-active': subMenuOpen === index })}`}
                                 >
                                    <span className="menu">
                                       <IntlMessages id={subMenu.menu_title} />
                                       {menu.new_item && menu.new_item === true ?
                                          <Chip label="new" className="new-item" color="secondary" />
                                          :
                                          null
                                       }
                                    </span>
                                 </ListItem>
                                 <Collapse in={subMenuOpen === index} timeout="auto">
                                    <List className="list-unstyled py-0">
                                       {subMenu.child_routes.map((nestedMenu, nestedKey) => (
                                          <ListItem button component="li" key={nestedKey}>
                                             <NavLink activeClassName="item-active" to={nestedMenu.path}>
                                                <span className="menu pl-10 d-inline-block">
                                                   <IntlMessages id={nestedMenu.menu_title} />
                                                   {menu.new_item && menu.new_item === true ?
                                                      <Chip label="new" className="new-item" color="secondary" />
                                                      :
                                                      null
                                                   }
                                                </span>
                                             </NavLink>
                                          </ListItem>
                                       ))}
                                    </List>
                                 </Collapse>
                              </Fragment>
                           )
                        })}
                     </List>
                  }
               </Fragment>
            </Collapse>
         </Fragment>
      )
   }
   return (
      <ListItem button component="li">
         <NavLink activeClassName="item-active" to={menu.path}>
            <ListItemIcon className="menu-icon">
               <i className={menu.menu_icon}></i>
            </ListItemIcon>
            <span className="menu">
               <IntlMessages id={menu.menu_title} />
            </span>
         </NavLink>
      </ListItem>
   );
}

export default NavMenuItem;
