/**
 * Horizontal App
 */
import React from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';

// horizontal layout
import RctHorizontalLayout from 'Components/RctHorizontalLayout';

// router service
import routerService from "Routes";

function RctHorizontalApp(props) {
   const { match, location } = props;
   if (location.pathname === '/horizontal') {
      return (<Redirect to={'/horizontal/dashboard/ecommerce'} />);
   }
   return (
      <RctHorizontalLayout>
         {routerService && routerService.map((route,key)=>
            <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
         )}
      </RctHorizontalLayout>
   );
}

export default withRouter(RctHorizontalApp);
