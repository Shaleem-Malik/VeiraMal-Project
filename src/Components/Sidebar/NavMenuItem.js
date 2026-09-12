/**
 * Nav Menu Item - NON-COLLAPSIBLE VERSION
 *
 * Special rule:
 * - Superusers can access "Manage Subcompanies" only when
 *   operating in the parent company.
 * - When a Superuser selects a subcompany, that menu item is hidden.
 */

import React, { Fragment } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  Chip
} from '@material-ui/core';
import {
  NavLink,
  useLocation
} from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';

function NavMenuItem(props) {
  const { menu } = props;
  const location = useLocation();

  // ============================================================
  // DETERMINE CURRENT COMPANY CONTEXT
  // ============================================================

  const parentCompanyId =
    localStorage.getItem('companyId');

  const selectedCompanyId =
    localStorage.getItem('selectedCompanyId');

  /*
   * Parent company:
   *
   * companyId = selectedCompanyId
   *
   * Subcompany:
   *
   * companyId !== selectedCompanyId
   */
  const isSubCompanySession =
    !!selectedCompanyId &&
    !!parentCompanyId &&
    selectedCompanyId !== parentCompanyId;

  // ============================================================
  // CHECK WHETHER A MENU ITEM SHOULD BE HIDDEN
  // ============================================================

  const shouldHideMenuItem = (menuItem) => {
    if (!menuItem) {
      return false;
    }

    /*
     * Manage Subcompanies must only be available
     * when operating in the parent company.
     */
    if (
      menuItem.path ===
      '/app/dashboard/subcompanies-management'
    ) {
      return isSubCompanySession;
    }

    return false;
  };

  // ============================================================
  // CHILD ROUTES
  // ============================================================

  if (menu.child_routes != null) {
    return (
      <Fragment>

        <div className="sub-menu">
          <Fragment>

            {menu.type_multi == null ? (

              <List className="list-unstyled py-0">

                {menu.child_routes
                  .filter(
                    (subMenu) =>
                      !shouldHideMenuItem(
                        subMenu
                      )
                  )
                  .map(
                    (
                      subMenu,
                      index
                    ) => (

                      <ListItem
                        button
                        component="li"
                        key={index}
                      >

                        <NavLink
                          to={subMenu.path}
                          activeClassName="item-active"
                        >

                          <span className="menu">
                            <IntlMessages
                              id={
                                subMenu.menu_title
                              }
                            />
                          </span>

                          {subMenu.new_item &&
                          subMenu.new_item ===
                            true ? (
                            <Chip
                              label="new"
                              className="new-item"
                              color="secondary"
                            />
                          ) : (
                            ''
                          )}

                        </NavLink>

                      </ListItem>
                    )
                  )}

              </List>

            ) : (

              <List className="list-unstyled py-0">

                {menu.child_routes
                  .filter(
                    (subMenu) =>
                      !shouldHideMenuItem(
                        subMenu
                      )
                  )
                  .map(
                    (
                      subMenu,
                      index
                    ) => (

                      <Fragment key={index}>

                        <ListItem
                          button
                          component="li"
                          className="list-item"
                        >

                          <span className="menu">
                            <IntlMessages
                              id={
                                subMenu.menu_title
                              }
                            />

                            {subMenu.new_item &&
                            subMenu.new_item ===
                              true ? (
                              <Chip
                                label="new"
                                className="new-item"
                                color="secondary"
                              />
                            ) : null}
                          </span>

                        </ListItem>

                        <div className="nested-sub-menu">

                          <List className="list-unstyled py-0">

                            {subMenu.child_routes
                              ?.filter(
                                (
                                  nestedMenu
                                ) =>
                                  !shouldHideMenuItem(
                                    nestedMenu
                                  )
                              )
                              .map(
                                (
                                  nestedMenu,
                                  nestedKey
                                ) => (

                                  <ListItem
                                    button
                                    component="li"
                                    key={
                                      nestedKey
                                    }
                                  >

                                    <NavLink
                                      activeClassName="item-active"
                                      to={
                                        nestedMenu.path
                                      }
                                    >

                                      <span className="menu pl-10 d-inline-block">

                                        <IntlMessages
                                          id={
                                            nestedMenu.menu_title
                                          }
                                        />

                                        {nestedMenu.new_item &&
                                        nestedMenu.new_item ===
                                          true ? (
                                          <Chip
                                            label="new"
                                            className="new-item"
                                            color="secondary"
                                          />
                                        ) : null}

                                      </span>

                                    </NavLink>

                                  </ListItem>
                                )
                              )}

                          </List>

                        </div>

                      </Fragment>
                    )
                  )}

              </List>

            )}

          </Fragment>
        </div>

      </Fragment>
    );
  }

  // ============================================================
  // SINGLE MENU ITEM
  // ============================================================

  if (shouldHideMenuItem(menu)) {
    return null;
  }

  return (
    <ListItem
      button
      component="li"
    >

      <NavLink
        activeClassName="item-active"
        to={menu.path}
      >

        <ListItemIcon className="menu-icon">
          <i
            className={
              menu.menu_icon
            }
          ></i>
        </ListItemIcon>

        <span className="menu">
          <IntlMessages
            id={
              menu.menu_title
            }
          />
        </span>

      </NavLink>

    </ListItem>
  );
}

export default NavMenuItem;