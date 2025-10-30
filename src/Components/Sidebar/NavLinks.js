// sidebar nav links
let sidebarMenu = {
   category1: [
      {
         "menu_title": "sidebar.dashboard",
         "menu_icon": "zmdi zmdi-view-dashboard",
         "type_multi": null,
         "new_item": true,
         "child_routes": [
            {
               "menu_title": "HR Dashboard",
               "new_item": false,
               "path": "/app/dashboard/ecommerce",
               "roles": ["Admin", "User"] // Not visible to CEO
            },
            {
               "path": "/dashboard/crm/dashboard",
               "new_item": true,
               "menu_title": "sidebar.crm",
               "roles": ["CEO", "User"] // Not visible to Admin
            },
            {
               "path": "/horizontal/dashboard/saas",
               "new_item": false,
               "menu_title": "sidebar.saas",
               "roles": ["Admin", "CEO", "User"] // Visible to all
            },
            // {
            //    "path": "/agency/dashboard/agency",
            //    "new_item": false,
            //    "menu_title": "sidebar.agency",
            //    "roles": ["Admin", "CEO", "User"] // Visible to all
            // },
            {
               "path": "/boxed/dashboard/news",
               "new_item": false,
               "menu_title": "sidebar.news",
               "roles": ["Admin", "CEO", "User"] // Visible to all
            },
            {
               "path": "/agency/dashboard/agency",
               "new_item": false,
               "menu_title": "Company Profile",
               "roles": ["Admin", "CEO", "User"] // Visible to all
            },
            {
               "path": "/agency/dashboard/quick-actions",
               "new_item": false,
               "menu_title": "Quick Actions",
               "roles": ["Admin", "CEO", "User"] // Visible to all
            },
            {
               "path": "/agency/dashboard/subcompanies-management",
               "new_item": false,
               "menu_title": "Manage Subcompanies",
               "roles": ["Admin", "CEO", "User"] // Visible to all
            }
         ]
      }
   ]
}

export default sidebarMenu