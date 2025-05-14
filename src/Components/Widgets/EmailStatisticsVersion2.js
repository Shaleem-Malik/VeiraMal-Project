/**
 * Email Statistics V2
 */
import React from 'react';

// chart
import EmailStatisticChart from 'Components/Charts/EmailStatistic';

function EmailStatisticsVersion2(props) {
   const { data } = props;
   return (
      <EmailStatisticChart
         labels={data.labels}
         datasets={data.datasets}
      />
   );
}

export default EmailStatisticsVersion2;
