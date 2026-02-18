// LiabilityGraphs.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Button
} from "@material-ui/core";
import { fetchLiabilityTracker } from "../../../Store/Actions/liabilityActions";
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";

// Color palette for different functions
const FUNCTION_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c",
  "#d0ed57", "#ffc0cb", "#8dd1e1", "#b0e57c", "#f4a582",
  "#92a8d1", "#f7cac9", "#b2b2b2", "#e08d79", "#6a4e9b",
  "#3f51b5", "#e91e63", "#00bcd4", "#009688", "#ff9800"
];

// Generate a consistent color for a function name
const getFunctionColor = (func) => {
  if (!func) return "#cccccc";
  let hash = 0;
  for (let i = 0; i < func.length; i++) {
    hash = ((hash << 5) - hash) + func.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % FUNCTION_COLORS.length;
  return FUNCTION_COLORS[index];
};

// Custom tooltip that shows function and other details
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // the original data item
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <p><strong>{data.name}</strong></p>
        <p>Function: {data.function}</p>
        <p>Amount: {formatCurrency(data.liabilityAmount)}</p>
        {data.organizationalUnit && <p>Department: {data.organizationalUnit}</p>}
      </div>
    );
  }
  return null;
};

// Formatting helpers
const formatDays = (value) => value.toLocaleString() + " days";
const formatCurrency = (value) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/**
 * Renders two liability graphs with function filtering.
 * @param {string} date - Optional date string to pass to fetch.
 */
export default function LiabilityGraphs({ date = null }) {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector(
    (state) => state.liabilities || { loading: false, data: [], error: null }
  );

  // Separate function selections for each graph
  const [deptSelectedFunctions, setDeptSelectedFunctions] = useState([]);
  const [empSelectedFunctions, setEmpSelectedFunctions] = useState([]);
  const [functionSearch, setFunctionSearch] = useState("");

  const history = useHistory();

  // Load data if not already present
  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchLiabilityTracker(date));
    }
  }, [dispatch, date, data]);

  useEffect(() => {
    if (error) NotificationManager.error(error);
  }, [error]);

  // Get unique functions from data
  const allFunctions = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const funcSet = new Set();
    data.forEach((item) => {
      if (item.function) funcSet.add(item.function);
    });
    return Array.from(funcSet).sort();
  }, [data]);

  // Filter functions by search
  const filteredFunctions = useMemo(() => {
    if (!functionSearch.trim()) return allFunctions;
    return allFunctions.filter((f) =>
      f.toLowerCase().includes(functionSearch.toLowerCase())
    );
  }, [allFunctions, functionSearch]);

  // Handlers for function selection
  const toggleDeptFunction = (func) => {
    setDeptSelectedFunctions((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const toggleEmpFunction = (func) => {
    setEmpSelectedFunctions((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const selectAllDept = () => setDeptSelectedFunctions([...allFunctions]);
  const clearAllDept = () => setDeptSelectedFunctions([]);

  const selectAllEmp = () => setEmpSelectedFunctions([...allFunctions]);
  const clearAllEmp = () => setEmpSelectedFunctions([]);

  // Filter data by selected functions
  const deptFilteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (deptSelectedFunctions.length === 0) return data;
    return data.filter((item) => deptSelectedFunctions.includes(item.function));
  }, [data, deptSelectedFunctions]);

  const empFilteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (empSelectedFunctions.length === 0) return data;
    return data.filter((item) => empSelectedFunctions.includes(item.function));
  }, [data, empSelectedFunctions]);

  // Department aggregation: group by organizationalUnit, sum balanceDays
  const departmentData = useMemo(() => {
    const agg = {};
    deptFilteredData.forEach((item) => {
      const dept = item.organizationalUnit || "Unknown";
      const days = Number(item.balanceDays) || 0;
      agg[dept] = (agg[dept] || 0) + days;
    });

    // Convert to array and sort by days descending, take top 50
    const sorted = Object.entries(agg)
      .map(([name, totalDays]) => ({ name, totalDays }))
      .sort((a, b) => b.totalDays - a.totalDays)
      .slice(0, 50);

    return sorted;
  }, [deptFilteredData]);

  // Employee top 50 by liabilityAmount – now includes function and department
  const employeeData = useMemo(() => {
    const sorted = [...empFilteredData]
      .sort((a, b) => {
        const amtA = Number(a.liabilityAmount) || 0;
        const amtB = Number(b.liabilityAmount) || 0;
        return amtB - amtA;
      })
      .slice(0, 50)
      .map((emp) => ({
        name: emp.employeeName || "Unknown",
        liabilityAmount: Number(emp.liabilityAmount) || 0,
        employeeId: emp.employeeId,
        function: emp.function || "Unknown",          // for coloring & tooltip
        organizationalUnit: emp.organizationalUnit,   // for tooltip
      }));
    return sorted;
  }, [empFilteredData]);

  // Compute unique functions present in employeeData for the legend
  const uniqueFunctionsInChart = useMemo(() => {
    const funcs = new Set();
    employeeData.forEach(item => {
      if (item.function) funcs.add(item.function);
    });
    return Array.from(funcs).sort();
  }, [employeeData]);

  return (
    <div className="liability-graphs-root">
      <div className="dashboard-controls">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="controls-left" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Show Detailed Analysis Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<i className="icon-chart" />}
              onClick={() => history.push('/app/dashboard/liability-tracker')}
              style={{
                borderRadius: '10px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Show Detailed Analysis
            </Button>

            {/* Upload Excel Button - Only for Super Users (commented out) */}
            {/* <Button ... >Upload File</Button> */}
          </div>

          {/* Optional right side content can go here */}
        </div>
      </div>

      <h2>Liability Graphs</h2>

      {/* Department Graph */}
      <div className="graph-container">
        <h3>Department Liability (Top 50 by Total Balance Days)</h3>

        {/* Function filter for department graph */}
        <div className="function-filter">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>Functions:</span>
            <button className="btn" onClick={selectAllDept}>
              Select All
            </button>
            <button className="btn" onClick={clearAllDept}>
              Clear All
            </button>
          </div>
          <input
            type="text"
            placeholder="Search functions..."
            value={functionSearch}
            onChange={(e) => setFunctionSearch(e.target.value)}
            className="function-search"
          />
          <div className="checkbox-group">
            {filteredFunctions.map((func) => (
              <label key={func} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deptSelectedFunctions.includes(func)}
                  onChange={() => toggleDeptFunction(func)}
                />
                {func}
              </label>
            ))}
          </div>
        </div>

        {loading && <div>Loading data...</div>}
        {!loading && departmentData.length === 0 && (
          <div>No department data available.</div>
        )}
        {!loading && departmentData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={departmentData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatDays} />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => formatDays(value)} />
              <Legend />
              <Bar dataKey="totalDays" fill="#8884d8" name="Total Days" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Employee Graph */}
      <div className="graph-container" style={{ marginTop: 40 }}>
        <h3>Employee Liability (Top 50 by Liability Amount)</h3>

        {/* Function filter for employee graph */}
        <div className="function-filter">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>Functions:</span>
            <button className="btn" onClick={selectAllEmp}>
              Select All
            </button>
            <button className="btn" onClick={clearAllEmp}>
              Clear All
            </button>
          </div>
          <input
            type="text"
            placeholder="Search functions..."
            value={functionSearch}
            onChange={(e) => setFunctionSearch(e.target.value)}
            className="function-search"
          />
          <div className="checkbox-group">
            {filteredFunctions.map((func) => (
              <label key={func} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={empSelectedFunctions.includes(func)}
                  onChange={() => toggleEmpFunction(func)}
                />
                {func}
              </label>
            ))}
          </div>
        </div>

        {loading && <div>Loading data...</div>}
        {!loading && employeeData.length === 0 && (
          <div>No employee data available.</div>
        )}
        {!loading && employeeData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={employeeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, angle: -45, textAnchor: "end" }}
                  height={80}
                  interval={0}
                />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="liabilityAmount" name="Liability Amount">
                  {employeeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getFunctionColor(entry.function)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Function Color Legend */}
            {uniqueFunctionsInChart.length > 0 && (
              <div className="function-legend">
                <h4>Function Colors</h4>
                <div className="legend-items">
                  {uniqueFunctionsInChart.map(func => (
                    <div key={func} className="legend-item">
                      <span
                        className="color-swatch"
                        style={{ backgroundColor: getFunctionColor(func) }}
                      />
                      <span className="function-name">{func}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .liability-graphs-root {
          padding: 20px;
          font-family: Inter, "Segoe UI", Roboto, sans-serif;
        }
        .graph-container {
          background: #fff;
          border: 1px solid #e6e9ee;
          border-radius: 8px;
          padding: 20px;
        }
        .function-filter {
          margin: 16px 0;
          padding: 12px;
          background: #f8f9fb;
          border-radius: 6px;
        }
        .function-search {
          width: 100%;
          max-width: 300px;
          padding: 6px 8px;
          margin: 8px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          max-height: 150px;
          overflow-y: auto;
          padding: 8px;
          border: 1px solid #eee;
          border-radius: 4px;
          background: #fff;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          white-space: nowrap;
        }
        .btn {
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
        }
        .btn:hover {
          background: #f0f0f0;
        }
        .function-legend {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e6e9ee;
        }
        .function-legend h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }
        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        .color-swatch {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .function-name {
          color: #374151;
        }
      `}</style>
    </div>
  );
}