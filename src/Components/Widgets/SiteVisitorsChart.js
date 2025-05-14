/**
 * Site Visitors Chart
 */
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// chart config
import ChartConfig from 'Constants/chart-config';

function SiteVisitorChart(props) {
   return (
      <ResponsiveContainer width='100%' height={330}>
         <LineChart data={props.data}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="pv" stroke={ChartConfig.color.primary} />
            <Line type="monotone" dataKey="uv" stroke={ChartConfig.color.warning} />
         </LineChart>
      </ResponsiveContainer>
   )
}

export default SiteVisitorChart;
