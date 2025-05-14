/**
 * App.js Layout Start Here
 */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
// rct theme provider
import RctThemeProvider from './RctThemeProvider';
//Horizontal Layout
import HorizontalLayout from './HorizontalLayout';
//Agency Layout
import AgencyLayout from './AgencyLayout';
//Main App
import RctDefaultLayout from './DefaultLayout';
// boxed layout
import RctBoxedLayout from './RctBoxedLayout';
// CRM layout
import CRMLayout from './CRMLayout';

function App(props) {   
   const { location } = props;
   if (location.pathname === '/') {
      return (<Redirect to={'/app/dashboard/ecommerce'} />);
   }
   return (
      <RctThemeProvider>
         <NotificationContainer />
         <Route path="/app" component={RctDefaultLayout} />
         <Route path="/horizontal" component={HorizontalLayout} />
         <Route path="/agency" component={AgencyLayout} />
         <Route path="/boxed" component={RctBoxedLayout} />
         <Route path="/dashboard" component={CRMLayout} />
      </RctThemeProvider>
   );
}

export default App;
