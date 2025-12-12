// File: SidebarContent.js (updated - remove upload)
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  List,
  ListSubheader,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import NavMenuItem from "./NavMenuItem";

function SidebarContent() {
  const sidebar = useSelector((state) => state.sidebar);
  const { sidebarMenus } = sidebar || {};

  // -------------------------
  // Role helpers & filtering
  // -------------------------
  const normalizeRole = (r) => {
    if (!r && r !== 0) return "";
    return String(r).toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const getUserRoles = () => {
    const raw = localStorage.getItem("access") || "";
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => normalizeRole(s))
      .filter(Boolean);
  };

  const isMenuVisibleForRoles = (menuItem, userRoles) => {
    if (!menuItem) return false;
    if (!Array.isArray(menuItem.roles) || menuItem.roles.length === 0) return true;
    const allowed = menuItem.roles.map((r) => normalizeRole(r));
    return allowed.some((a) => userRoles.includes(a));
  };

  const userRoles = getUserRoles();

  // defensive: if sidebarMenus or category1 missing, render nothing for menus
  const rawCategory1 = (sidebarMenus && sidebarMenus.category1) ? sidebarMenus.category1 : [];

  // Filter child routes by user roles, drop menus that become empty
  const filteredCategory1 = rawCategory1
    .map((menu) => {
      if (!menu.child_routes || !Array.isArray(menu.child_routes)) return menu;
      const filteredChildren = menu.child_routes.filter((child) =>
        isMenuVisibleForRoles(child, userRoles)
      );
      return { ...menu, child_routes: filteredChildren };
    })
    .filter((menu) => {
      if (menu.child_routes && Array.isArray(menu.child_routes)) {
        return menu.child_routes.length > 0;
      }
      return true;
    });

  return (
    <div className="rct-sidebar-nav">
      <nav className="navigation">
        {filteredCategory1 && filteredCategory1.length > 0 && (
          <List
            className="rct-mainMenu p-0 m-0 list-unstyled"
            subheader={
              <ListSubheader className="side-title" component="li">
                {/* <IntlMessages id="sidebar.general" /> */}
              </ListSubheader>
            }
          >
            {filteredCategory1.map((menu, key) => (
              // Removed onToggleMenu prop since menu is non-collapsible
              <NavMenuItem
                menu={menu}
                key={key}
                onToggleMenu={() => {}} // Empty function as placeholder
              />
            ))}
          </List>
        )}
      </nav>
    </div>
  );
}

export default withRouter(SidebarContent);