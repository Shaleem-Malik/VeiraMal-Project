// src/Widgets/HeadcountAnalysisChart.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeadcountAnalysis } from "../../Store/Actions/headcountActions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HeadcountAnalysisChart = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.headcount);

  useEffect(() => {
     if (!snapshotData) {
       dispatch(fetchHeadcountAnalysis());
     }
   }, [dispatch, snapshotData]);

  const finalData = snapshotData || data;
  if (loading && !snapshotData) return <p className="m-2">Loading Headcount Analysis...</p>;
  if (error && !snapshotData) return <p className="m-2 text-danger">Error: {error}</p>;
  if (!finalData.length) return <p className="m-2">No headcount data available.</p>;

  // ✅ Gender distribution (per department)
  const genderChartData = {
    labels: finalData.map((row) => row.department ?? "-"),
    datasets: [
      {
        label: "Male",
        data: finalData.map((row) => row.maleCount || 0),
        backgroundColor: "#4e79a7",
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Female",
        data: finalData.map((row) => row.femaleCount || 0),
        backgroundColor: "#f28e2b",
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const genderOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
      title: {
        display: true,
        text: "Gender Distribution by Department",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: false, maxRotation: 60, minRotation: 45 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Headcount" },
      },
    },
  };

  // ✅ Permanent vs Temporary (stacked horizontal bar)
  const contractChartData = {
    labels: finalData.map((row) => row.department ?? "-"),
    datasets: [
      {
        label: "Permanent",
        data: finalData.map((row) => row.headcountPercentage || 0),
        backgroundColor: "#59a14f",
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Temporary",
        data: finalData.map((row) => row.tempPercentage || 0),
        backgroundColor: "#e15759",
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const contractOptions = {
    indexAxis: "y", // horizontal
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}%`,
        },
      },
      title: {
        display: true,
        text: "Permanent vs Temporary (%)",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
        title: { display: true, text: "Percentage (%)" },
      },
      y: {
        title: { display: true, text: "Department" },
      },
    },
  };

  return (
    <div className="card p-3 shadow-sm">
      <h3 className="mb-4">Headcount Analysis</h3>

      {/* Gender Bar Chart */}
      <div className="mb-5">
        <Bar data={genderChartData} options={genderOptions} height={120} />
      </div>

      {/* Permanent vs Temporary */}
      <div>
        <Bar data={contractChartData} options={contractOptions} height={150} />
      </div>
    </div>
  );
};

export default HeadcountAnalysisChart;
