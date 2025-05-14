/**
 * Agency Dashboard
 */
import React from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

export default function saasDashbaord(props) {
   const { match } = props;
   return (
      <div className="saas-dashboard">
         <Helmet>
            <title>Sass Dashboard</title>
            <meta name="description" content="Reactify Sass Dashboard" />
         </Helmet>
         <PageTitleBar title={<IntlMessages id="sidebar.saas" />} match={match} />
      </div>
   )
}
