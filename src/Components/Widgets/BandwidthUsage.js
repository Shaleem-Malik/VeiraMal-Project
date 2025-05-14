/**
 * Bandwidth Usage Widget
 */
import React, { useEffect, useState } from 'react';
import ReactSpeedometer from "react-d3-speedometer";

function BandwidthUsageWidget() {
   const [bandwidthUsage, setBandwidthUsage] = useState(200);

   useEffect(() => {
      setInterval(() => {
         setBandwidthUsage(Math.floor(Math.random() * 1000) + 1)
      }, 2000);
   },[])
   return (
      <div className="card">
         <ReactSpeedometer
            value={bandwidthUsage}
            startColor="red"
            endColor="green"
            height={200}
            ringWidth={40}
            needleColor="#895DFF"
         />
      </div>
   );
}

export default BandwidthUsageWidget;
