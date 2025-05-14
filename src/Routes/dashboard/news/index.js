/**
 * News Dashboard
 */

import React from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
export default function NewsDashboard(props){
   const { match } = props;
   return (
      <div className="news-dashboard-wrapper">
         <Helmet>
            <title>News Dashboard</title>
            <meta name="description" content="Reactify News Dashboard" />
         </Helmet>
         <PageTitleBar title={<IntlMessages id="sidebar.news" />} match={match} />
      </div>
   )
}
