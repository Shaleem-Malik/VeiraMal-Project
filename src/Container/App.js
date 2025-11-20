/**
 * App.js Layout Start Here
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

// Theme provider
import RctThemeProvider from './RctThemeProvider';

// Layouts
import HorizontalLayout from './HorizontalLayout';
import AgencyLayout from './AgencyLayout';
import RctDefaultLayout from './DefaultLayout';
import RctBoxedLayout from './RctBoxedLayout';
import CRMLayout from './CRMLayout';

// Auth
import Auth from 'Auth/Auth';
import Signin from './SigninFirebase';
import Signup from './SignupFirebase';
import ResetPassword from './ResetPassword';
import BusinessUnitSelector from './BusinessUnitSelector';
import CompanySelector from './CompanySelector';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutCancel from './CheckoutCancel';
import ForgotPassword from './ForgotPassword';

function App(props) {
   const { location } = props;
   const isAuthenticated = Auth.isUserAuthenticated && Auth.isUserAuthenticated();

   const basePath = process.env.PUBLIC_URL;

   if (
      location.pathname === '/' ||
      location.pathname === `${basePath}/`
   ) {
      return (
         <Redirect to={isAuthenticated ? `${basePath}/app/dashboard/ecommerce` : `${basePath}/signin`} />
      );
   }

   return (
      <RctThemeProvider>
         <NotificationContainer />
         <Switch>
            <Route path={`${basePath}/signin`} component={Signin} />
            <Route path={`${basePath}/signup`} component={Signup} />
            <Route path={`${basePath}/reset-password`} component={ResetPassword} />
            <Route path={`${basePath}/choose-business-unit`} component={BusinessUnitSelector}/>
            <Route path={`${basePath}/choose-company`} component={CompanySelector}/>
            <Route path={`${basePath}/app`} component={RctDefaultLayout} />
            <Route path={`${basePath}/horizontal`} component={HorizontalLayout} />
            <Route path={`${basePath}/agency`} component={AgencyLayout} />
            <Route path={`${basePath}/boxed`} component={RctBoxedLayout} />
            <Route path={`${basePath}/dashboard`} component={CRMLayout} />
            <Route path={`${basePath}/checkout-success`} component={CheckoutSuccess} />
            <Route path={`${basePath}/checkout-cancel`} component={CheckoutCancel} />
            <Route path={`${basePath}/forgot-password`} component={ForgotPassword} />
         </Switch>
      </RctThemeProvider>
   );
}

export default App;
