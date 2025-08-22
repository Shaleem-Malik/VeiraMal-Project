// src/components/widgets/NhtAnalysisChart.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNhtAnalysis } from "../../Store/Actions/nhtActions";
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

const NhtAnalysisChart = () => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.nht);

  useEffect(() => {
    dispatch(fetchNhtAnalysis());
  }, [dispatch]);

  if (loading) return <p className="m-2">Loading Career Management data...</p>;
  if (error) return <p className="m-2 text-danger">Error: {error}</p>;
  if (!data.length) return <p className="m-2">No Career Management data available.</p>;

  // Transform data for chart
  const chartData = data.map((row) => ({
    department: row.department ?? "-",
    "New Hires (M)": row.newHireMale ?? 0,
    "New Hires (F)": row.newHireFemale ?? 0,
    "Promotions (M)": row.transferMale ?? 0,
    "Promotions (F)": row.transferFemale ?? 0,
  }));

  return (
    <div className="card p-3 shadow-sm">
      <h3 className="mb-4">Career Management Overview</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
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
          />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="New Hires (M)" fill="#4e79a7" barSize={18} radius={[4, 4, 0, 0]} />
          <Bar dataKey="New Hires (F)" fill="#f28e2b" barSize={18} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Promotions (M)" fill="#59a14f" barSize={18} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Promotions (F)" fill="#e15759" barSize={18} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NhtAnalysisChart;
