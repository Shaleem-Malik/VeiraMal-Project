/**
 * Ecommerce Dashboard
 */

import React from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

export default function EcommerceDashboard(props) {
   const { match } = props;
   return (
      <div className="ecom-dashboard-wrapper">
         <Helmet>
            <title>Ecommerce Dashboard</title>
            <meta name="description" content="Reactify Ecommerce Dashboard" />
         </Helmet>
         <PageTitleBar title={<IntlMessages id="sidebar.ecommerce" />} match={match} />
      </div>
   )
}
