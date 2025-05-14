//Visitors Widget
import React, { Fragment } from 'react'
import CountUp from 'react-countup';
// chart
import NewsVisitorsChart from 'Components/Charts/NewsVisitorsChart';

function Visitors(props){
   const { chartLabels, chartDatasets } = props.chartData;
   return (
      <Fragment>
         <div className="top-content mb-3">
            <CountUp
               separator=","
               className="count-value"
               start={0}
               end={12500}
               duration={5}
               useEasing={true}
            />
            <div className="">
               <span className="text-success">
                  <i className="zmdi zmdi-long-arrow-up zmdi-hc-lg mr-2"></i>
                  <span className="font-xs">+24% </span>
               </span>
               <span className="font-xs text-muted">From Last Month</span>
            </div>
         </div>
         <div className="chart-wrap">
            <NewsVisitorsChart
               labels={chartLabels}
               datasets={chartDatasets}
            />
         </div>
      </Fragment>
   )
}

export default Visitors;