/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from 'react';
import Loadable from 'react-loadable';

// rct page loader
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';

// ecommerce dashboard
const AsyncEcommerceDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/ecommerce"),
	loading: () => <RctPageLoader />,
});

// agency dashboard
const AsyncSaasDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/saas"),
	loading: () => <RctPageLoader />,
});

// agency dashboard
const AsyncAgencyDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/agency"),
	loading: () => <RctPageLoader />,
});

// boxed dashboard
const AsyncNewsDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/news"),
	loading: () => <RctPageLoader />,
});

// crm dashboard
const AsyncCrmComponent = Loadable({
	loader: () => import("Routes/crm/dashboard"),
	loading: () => <RctPageLoader />,
});

const AsyncAnalysisDetailComponent = Loadable({
	loader: () => import("Routes/crm/dashboard/AnalysisDetail"),
	loading: () => <RctPageLoader />,
});

const AsyncLiveAnalysisDetailComponent = Loadable({
	loader:() => import("Routes/dashboard/ecommerce/LiveAnalysisDetail"),
	loading: () => <RctPageLoader />,
});

const AsyncLiveCompanyDetailsComponent = Loadable({
	loader:() => import("Routes/dashboard/agency/CompanyDetails"),
	loading: () => <RctPageLoader />,
});

const AsynQuickActions = Loadable({
	loader:() => import("Routes/dashboard/agency/QuickActionsContainer"),
	loading: () => <RctPageLoader />,
});

const AsynSubCompaniesManagement = Loadable({
	loader:() => import("Routes/dashboard/agency/SubCompaniesManagement"),
	loading: () => <RctPageLoader />,
})



export {
	AsyncEcommerceDashboardComponent,
	AsyncSaasDashboardComponent,
	AsyncAgencyDashboardComponent,
	AsyncNewsDashboardComponent,
	AsyncCrmComponent,
	AsyncAnalysisDetailComponent,
	AsyncLiveAnalysisDetailComponent,
	AsyncLiveCompanyDetailsComponent,
	AsynQuickActions,
	AsynSubCompaniesManagement
};
