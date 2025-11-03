// src/components/widgets/NhtAnalysisChart.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNhtAnalysis } from "../../Store/Actions/nhtActions";
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

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NhtAnalysisChart = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.nht);

  // Load live data only if no snapshot provided
  useEffect(() => {
    if (!snapshotData) {
      dispatch(fetchNhtAnalysis());
    }
  }, [dispatch, snapshotData]);

  const finalData = snapshotData || data;

  if (!snapshotData && loading)
    return <p className="m-2">Loading Career Management data...</p>;
  if (!snapshotData && error)
    return <p className="m-2 text-danger">Error: {error}</p>;
  if (!finalData.length)
    return <p className="m-2">No Career Management data available.</p>;

  // Chart.js datasets
  const chartData = {
    labels: finalData.map((row) => row.department ?? "-"),
    datasets: [
      {
        label: "New Hires (M)",
        data: finalData.map((row) => row.newHireMale ?? 0),
        backgroundColor: "#4e79a7",
      },
      {
        label: "New Hires (F)",
        data: finalData.map((row) => row.newHireFemale ?? 0),
        backgroundColor: "#f28e2b",
      },
      {
        label: "Promotions (M)",
        data: finalData.map((row) => row.transferMale ?? 0),
        backgroundColor: "#59a14f",
      },
      {
        label: "Promotions (F)",
        data: finalData.map((row) => row.transferFemale ?? 0),
        backgroundColor: "#e15759",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 13 },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Career Management Overview",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        titleColor: "#333",
        bodyColor: "#333",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#eee",
        },
      },
    },
  };

  return (
    <div className="card p-3 shadow-sm">
      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default NhtAnalysisChart;
