// sidebar nav links
let sidebarMenu = {
   category1: [
      {
         "menu_title": "sidebar.dashboard",
         "menu_icon": "zmdi zmdi-view-dashboard",
         "type_multi": null,
         "new_item": false,
         "child_routes": [
            {
               "menu_title": "HR Dashboard",
               "new_item": false,
               "path": "/app/dashboard/ecommerce",
               "roles": ["superUser"]
            },
            {
               "path": "/app/crm/dashboard",
               "new_item": false,
               "menu_title": "CEO",
               "roles": ["CEO"]
            },
            {
               "path": "/app/dashboard/saas",
               "new_item": false,
               "menu_title": "TM Dashboard",
               "roles": ["Team Manager"]
            },
            {
               "path": "/app/dashboard/news",
               "new_item": true,
               "menu_title": "sidebar.news",
               "roles": ["superUser", "Team Manager", "CEO"]
            },
            {
               "path": "/app/dashboard/agency",
               "new_item": false,
               "menu_title": "Company Profile",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/quick-actions",
               "new_item": false,
               "menu_title": "Quick Actions",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/subcompanies-management",
               "new_item": false,
               "menu_title": "Manage Subcompanies",
               "roles": ["superUser"]
            }
         ]
      }
   ]
}

export default sidebarMenu