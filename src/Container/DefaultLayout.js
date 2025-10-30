/**
 * App Routes
 */
import React from 'react';
import { Route, withRouter } from 'react-router-dom';

// app default layout
import RctAppLayout from 'Components/RctAppLayout';

// router service
import routerService from "Routes";

function DefaultLayout(props){
   const { match } = props;
   return (
      <RctAppLayout>
         {routerService && routerService.map((route,key)=>
            <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
         )}
      </RctAppLayout>
   );
}

export default withRouter(DefaultLayout);
