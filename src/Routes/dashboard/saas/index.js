/**
 * Agency Dashboard
 */
import React from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';
import "../ecommerce/AdminDashboard.css";
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import FinanceHeadcountAnalysisWidget from 'Components/Widgets/FinanceHeadcountAnalysisWidget';

// import FinanceNHTAnalysisWidget from 'Components/Widgets/FinanceNHTAnalysisWidget';

export default function saasDashbaord(props) {
   const { match } = props;
   const businessUnit = localStorage.getItem('BusinessUnit');
   return (
      <div className="saas-dashboard">
         <Helmet>
            <title>Team Manager Dashboard</title>
            <meta name="description" content="Reactify Sass Dashboard" />
         </Helmet>
         <PageTitleBar title={<IntlMessages id={`${businessUnit} Dashboard`} />} match={match} />
         <FinanceHeadcountAnalysisWidget></FinanceHeadcountAnalysisWidget>
         {/* <FinanceNHTAnalysisWidget></FinanceNHTAnalysisWidget> */}
      </div>
   )
}

