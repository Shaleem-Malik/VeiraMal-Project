/**
 * Agency Dashboard
 */

import React from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';


export default function AgencyDashboard(props) {
   const { match } = props;
   return (
      <div className="agency-dashboard-wrapper">
         <Helmet>
            <title>Agency Dashboard</title>
            <meta name="description" content="Reactify Agency Dashboard" />
         </Helmet>
         <PageTitleBar title={<IntlMessages id="sidebar.agency" />} match={match} />
      </div>
   )
}
