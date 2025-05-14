/**
 * Horizontal App
 */
import React from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';

// app default layout
import RctCRMLayout from 'Components/RctCRMLayout';

// router service
import routerService from "Routes";

function CRMLayout(props){
   const { match, location } = props;
   if (location.pathname === '/dashboard') {
      return (<Redirect to={'/dashboard/crm/dashboard'} />);
   }
   return (
      <RctCRMLayout >
         {routerService && routerService.map((route, key) =>
            <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
         )}
      </RctCRMLayout >
   );
}

export default withRouter(CRMLayout);
