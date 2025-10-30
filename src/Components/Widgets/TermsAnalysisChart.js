// src/components/widgets/TermsAnalysisChart.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermsAnalysis } from "../../Store/Actions/termsActions";
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

const TermsAnalysisChart = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { loading, data: liveData = [], error } = useSelector((state) => state.terms);

  // Only fetch live terms analysis if snapshot wasn't provided
  useEffect(() => {
    if (!snapshotData) {
      dispatch(fetchTermsAnalysis());
    }
  }, [dispatch, snapshotData]);

  const finalData = snapshotData || liveData;

  if (!snapshotData && loading) return <p>Loading turnover analysis...</p>;
  if (!snapshotData && error) return <p className="text-danger">Error: {error}</p>;
  if (!finalData || !finalData.length) return <p>No turnover data available.</p>;

  // Transform data for chart.js
  const departments = finalData.map((row) => row.department ?? "-");

  const voluntaryData = {
    labels: departments,
    datasets: [
      {
        label: "Male",
        data: finalData.map((row) => row.voluntaryMaleRate || 0),
        backgroundColor: "#4e79a7",
      },
      {
        label: "Female",
        data: finalData.map((row) => row.voluntaryFemaleRate || 0),
        backgroundColor: "#f28e2b",
      },
    ],
  };

  const involuntaryData = {
    labels: departments,
    datasets: [
      {
        label: "Male",
        data: finalData.map((row) => row.involuntaryMaleRate || 0),
        backgroundColor: "#76b7b2",
      },
      {
        label: "Female",
        data: finalData.map((row) => row.involuntaryFemaleRate || 0),
        backgroundColor: "#edc949",
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 13 }, color: "#333" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: "#666",
          font: { size: 12 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}%`,
          color: "#666",
          font: { size: 12 },
        },
        grid: { color: "#eee" },
      },
    },
  };

  const chartCardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    padding: "20px",
    marginBottom: "30px",
  };

  return (
    <>
      {/* Voluntary Turnover */}
      <div style={chartCardStyle}>
        <h4 style={{
            fontWeight: "600",
            color: "#333",
            marginBottom: "15px",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
          }}>
          Voluntary Turnover by Gender (%)
        </h4>
        <div style={{ height: "400px" }}>
          <Bar data={voluntaryData} options={baseOptions} />
        </div>
      </div>

      {/* Involuntary Turnover */}
      <div style={chartCardStyle}>
        <h4 style={{
            fontWeight: "600",
            color: "#333",
            marginBottom: "15px",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
          }}>
          Involuntary Turnover by Gender (%)
        </h4>
        <div style={{ height: "400px" }}>
          <Bar data={involuntaryData} options={baseOptions} />
        </div>
      </div>
    </>
  );
};

export default TermsAnalysisChart;
