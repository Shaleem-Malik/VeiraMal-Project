/**
 * Crm Dashboard
 */
/* eslint-disable */
import React from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

export default function CrmDashboard(props){
   const { match } = props;
   return (
      <div className="ecom-dashboard-wrapper">
         <Helmet>
            <title>Crm Dashboard</title>
            <meta name="description" content="Reactify Crm Dashboard" />
         </Helmet>
         <PageTitleBar title={<IntlMessages id="sidebar.crm" />} match={match} />
      </div>
   )
}
