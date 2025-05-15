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
            <Route path={`${basePath}/app`} component={RctDefaultLayout} />
            <Route path={`${basePath}/horizontal`} component={HorizontalLayout} />
            <Route path={`${basePath}/agency`} component={AgencyLayout} />
            <Route path={`${basePath}/boxed`} component={RctBoxedLayout} />
            <Route path={`${basePath}/dashboard`} component={CRMLayout} />
         </Switch>
      </RctThemeProvider>
   );
}

export default App;
