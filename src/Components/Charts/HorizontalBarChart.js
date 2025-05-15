/**
 * Horizontal Bar Chart - Chart.js v3+ compatible
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

function HorizontalBarChart({ labels, label, chartdata, height }) {
  const data = {
    labels,
    datasets: [
      {
        barPercentage: 1.0,
        categoryPercentage: 0.45,
        label,
        backgroundColor: ChartConfig.color.info,
        borderColor: ChartConfig.color.info,
        borderWidth: 1,
        hoverBackgroundColor: ChartConfig.color.info,
        hoverBorderColor: ChartConfig.color.info,
        data: chartdata,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This makes it horizontal
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: ChartConfig.chartGridColor,
          drawBorder: false,
        },
        ticks: {
          color: ChartConfig.axesColor,
          min: 1,
          max: 9,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: ChartConfig.axesColor,
        },
      },
    },
  };

  return <Bar data={data} options={options} height={height} />;
}

export default HorizontalBarChart;
