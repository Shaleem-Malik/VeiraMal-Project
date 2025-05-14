/**
 * Total Earns With Area Chart
 */
import React, { Fragment } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

// chart
import StackedAreaChart from 'Components/Charts/StackedAreaChart';

function TotalEarnsWithAreaChart(props){
   const { datasets, labels } = props.chartData;
   return (
      <Fragment>
            <div className="chart-top total-earn-chart d-flex justify-content-between mb-50">
               <div className="d-flex align-items-end">
                  <span className="badge-primary badge-sm">&nbsp;</span><span className="fs-12">Sales</span>
                  <span className="badge-warning badge-sm">&nbsp;</span><span className="fs-12">Visitors</span>
               </div>
               <div className="d-flex align-items-start display-n">
                  <ButtonGroup className="default-btn-group">
                        <Button className="btn-sm">Week</Button>
                        <Button className="btn-sm active">Month</Button>
                        <Button className="btn-sm">Year</Button>
                        <Button className="btn-sm">Today</Button>
                  </ButtonGroup>
               </div>
            </div>
            <StackedAreaChart
               labels={labels}
               datasets={datasets}
            />
      </Fragment>
   );
}

export default TotalEarnsWithAreaChart;
