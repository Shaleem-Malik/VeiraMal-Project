/**
 * Product Stats Widget
 */
import React, { Fragment } from 'react';
// chart
import ProductStatsChart from 'Components/Charts/ProductStatsChart';

function ProductStats(props){
   const { data } = props;
   return (
      <Fragment>
         <div className="chart-top mb-4">
            {data && data.customLegends.map((legend, key) => (
               <Fragment key={key}>
                     <span className={`${legend.class} ladgend mr-10`}>&nbsp;</span>
                     <span className="fs-12 mr-10">{legend.name}</span>
               </Fragment>
            ))}
         </div>
         <ProductStatsChart
            labels={data && data.labels}
            datasets={data && data.datasets}
         />
      </Fragment>
   );
}

export default ProductStats;
