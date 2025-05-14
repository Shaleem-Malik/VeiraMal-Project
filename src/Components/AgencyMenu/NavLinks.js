// Agency nav links
let navlinks = {
   category1: [
      {
         "menu_title": "sidebar.dashboard",
         "menu_icon": "zmdi zmdi-view-dashboard",
         "new_item": true,
         "child_routes": [
            {
               "path": "/app/dashboard/ecommerce",
               "menu_title": "sidebar.ecommerce",
               "new_item": false,
               exact: true
            },
            {
               "path": "/dashboard/crm/dashboard",
               "new_item": true,
               "menu_title": "sidebar.crm",
               exact: true
            },
            {
               "path": "/horizontal/dashboard/saas",
               "menu_title": "sidebar.saas",
               "new_item": false,
               exact: true
            },
            {
               "path": "/agency/dashboard/agency",
               "menu_title": "sidebar.agency",
               "new_item": false,
               exact: true
            },
            {
               "path": "/boxed/dashboard/news",
               "menu_title": "sidebar.news",
               "new_item": false,
               exact: true
            }
         ]
      }
   ]
}

export default navlinks;