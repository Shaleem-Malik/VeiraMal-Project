/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
   AsyncEcommerceDashboardComponent,
   AsyncSaasDashboardComponent,
   AsyncAgencyDashboardComponent,
   AsyncNewsDashboardComponent,
   AsyncLiveAnalysisDetailComponent,
   AsyncLiveCompanyDetailsComponent,
   AsynQuickActions,
   AsynSubCompaniesManagement,
   AsynUserProfile,
   AsyncLiabilityTrackerComponent,
   AsyncAdminDashboardComponent,
   AsyncAdminSampleSheets
} from 'Components/AsyncComponent/AsyncComponent';

const Dashboard = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/ecommerce`} />
         <Route path={`${match.url}/ecommerce`} component={AsyncEcommerceDashboardComponent} />
         <Route path={`${match.url}/saas`} component={AsyncSaasDashboardComponent} />
         <Route path={`${match.url}/agency`} component={AsyncAgencyDashboardComponent} />
         <Route path={`${match.url}/news`} component={AsyncNewsDashboardComponent} />
         <Route path={`${match.url}/liability-tracker`} component={AsyncLiabilityTrackerComponent} />
         <Route path={`${match.url}/live-analysis-detail`} component={AsyncLiveAnalysisDetailComponent} />
         <Route path={`${match.url}/company-details`} component={AsyncLiveCompanyDetailsComponent} />
         <Route path={`${match.url}/quick-actions`} component={AsynQuickActions} />
         <Route path={`${match.url}/subcompanies-management`} component={AsynSubCompaniesManagement} />
         <Route path={`${match.url}/user-profile`} component={AsynUserProfile} />
         <Route path={`${match.url}/admin`} component={AsyncAdminDashboardComponent} />
         <Route path={`${match.url}/admin-sample-sheets`} component={AsyncAdminSampleSheets} />
      </Switch>
   </div>
);

export default Dashboard;
