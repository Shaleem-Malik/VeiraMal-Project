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
               "path": "/app/dashboard/hr-analytics/overview",
               "new_item": false,
               "menu_title": "Overview",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/workforce-diversity",
               "new_item": false,
               "menu_title": "Workforce & Diversity",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/attrition-retention",
               "new_item": false,
               "menu_title": "Attrition & Retention",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/settings",
               "new_item": false,
               "menu_title": "Settings",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/labour-cost",
               "new_item": true,
               "menu_title": "Labour Cost",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/absenteeism",
               "new_item": true,
               "menu_title": "Absenteeism",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/recruitment",
               "new_item": true,
               "menu_title": "Recruitment",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/performance",
               "new_item": true,
               "menu_title": "Performance",
               "roles": ["superUser"]
            },
            {
               "path": "/app/dashboard/hr-analytics/scenario-modelling",
               "new_item": true,
               "menu_title": "Scenario Modelling",
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
               "new_item": false,
               "menu_title": "Liability Tracker",
               "roles": ["superUser"]
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
            },
            {
               "path": "/app/dashboard/admin",
               "new_item": false,
               "menu_title": "Admin Dashboard",
               "roles": ["superAdmin"]
            },
            {
               "path": "/app/dashboard/admin-sample-sheets",
               "new_item": false,
               "menu_title": "Admin Sample Sheets",
               "roles": ["superAdmin"]             
            }
         ]
      }
   ]
}

export default sidebarMenu