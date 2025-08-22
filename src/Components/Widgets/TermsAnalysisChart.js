import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermsAnalysis } from "../../Store/Actions/termsActions";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList
} from "recharts";

const TermsAnalysisChart = () => {
  const dispatch = useDispatch();
  const { loading, data = [], error } = useSelector((state) => state.terms);

  useEffect(() => {
    dispatch(fetchTermsAnalysis());
  }, [dispatch]);

  if (loading) return <p>Loading turnover analysis...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No turnover data available.</p>;

  const voluntaryData = data.map((row) => ({
    department: row.department,
    Male: row.voluntaryMaleRate || 0,
    Female: row.voluntaryFemaleRate || 0
  }));

  const involuntaryData = data.map((row) => ({
    department: row.department,
    Male: row.involuntaryMaleRate || 0,
    Female: row.involuntaryFemaleRate || 0
  }));

  const chartCardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    padding: "20px",
    marginBottom: "30px"
  };

  const tooltipStyle = {
    background: "#1f2937",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    fontSize: "13px"
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
          paddingBottom: "8px"
        }}>
          Voluntary Turnover by Gender (%)
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={voluntaryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="department"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip formatter={(value) => `${value}%`} contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="Male" fill="#4e79a7" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="Male" position="top" formatter={(v) => `${v}%`} fill="#333" fontSize={11} />
            </Bar>
            <Bar dataKey="Female" fill="#f28e2b" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="Female" position="top" formatter={(v) => `${v}%`} fill="#333" fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Involuntary Turnover */}
      <div style={chartCardStyle}>
        <h4 style={{
          fontWeight: "600",
          color: "#333",
          marginBottom: "15px",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px"
        }}>
          Involuntary Turnover by Gender (%)
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={involuntaryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="department"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip formatter={(value) => `${value}%`} contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="Male" fill="#76b7b2" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="Male" position="top" formatter={(v) => `${v}%`} fill="#333" fontSize={11} />
            </Bar>
            <Bar dataKey="Female" fill="#edc949" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="Female" position="top" formatter={(v) => `${v}%`} fill="#333" fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default TermsAnalysisChart;
