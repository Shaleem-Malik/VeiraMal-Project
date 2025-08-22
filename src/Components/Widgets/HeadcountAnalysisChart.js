// src/Widgets/HeadcountAnalysisChart.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeadcountAnalysis } from "../../Store/Actions/headcountActions";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const HeadcountAnalysisChart = () => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.headcount);

  useEffect(() => {
    dispatch(fetchHeadcountAnalysis());
  }, [dispatch]);

  if (loading) return <p className="m-2">Loading Headcount Analysis...</p>;
  if (error) return <p className="m-2 text-danger">Error: {error}</p>;
  if (!data.length) return <p className="m-2">No headcount data available.</p>;

  // Chart for gender distribution
  const genderChartData = data.map((row) => ({
    department: row.department ?? "-",
    Male: row.maleCount || 0,
    Female: row.femaleCount || 0,
    Total: row.headcount || 0,
  }));

  // Chart for Permanent vs Temporary
  const contractChartData = data.map((row) => ({
    department: row.department ?? "-",
    Permanent: row.headcountPercentage || 0,
    Temporary: row.tempPercentage || 0,
  }));

  return (
    <div className="card p-3 shadow-sm">
      <h3 className="mb-4">Headcount Analysis</h3>

      {/* Gender Bar Chart */}
      <h5 className="mt-3">Gender Distribution</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={genderChartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="department"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            formatter={(value) => [value, "Count"]}
          />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Male" fill="#4e79a7" barSize={20} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Female" fill="#f28e2b" barSize={20} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Permanent vs Temporary Horizontal Chart */}
      <h5 className="mt-5">Permanent vs Temporary (%)</h5>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={contractChartData}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis dataKey="department" type="category" width={120} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar
            dataKey="Permanent"
            stackId="a"
            fill="#59a14f"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="Temporary"
            stackId="a"
            fill="#e15759"
            radius={[4, 0, 0, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeadcountAnalysisChart;
