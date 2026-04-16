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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";
import { fetchLiabilityTracker } from "../../../Store/Actions/liabilityActions";

// Color palette for different functions
const FUNCTION_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c",
  "#d0ed57", "#ffc0cb", "#8dd1e1", "#b0e57c", "#f4a582",
  "#92a8d1", "#f7cac9", "#b2b2b2", "#e08d79", "#6a4e9b",
  "#3f51b5", "#e91e63", "#00bcd4", "#009688", "#ff9800"
];

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "/api/";

// Generate a consistent color for a function name
const getFunctionColor = (func) => {
  if (!func) return "#cccccc";
  let hash = 0;
  for (let i = 0; i < func.length; i++) {
    hash = ((hash << 5) - hash) + func.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FUNCTION_COLORS.length;
  return FUNCTION_COLORS[index];
};

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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
const formatDays = (value) => `${Number(value).toLocaleString()} days`;
const formatCurrency = (value) =>
  Number(value).toLocaleString(undefined, {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const EMPTY_FILES = {
  headcount: null,
  leaveTaken: null,
  sapLeaveBalance: null,
  baseRates: null,
};

async function uploadSingleFile(endpoint, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

/**
 * Renders two liability graphs with function filtering and upload modal.
 */
export default function LiabilityGraphs({ date = null }) {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector(
    (state) => state.liabilities || { loading: false, data: [], error: null }
  );

  const [deptSelectedFunctions, setDeptSelectedFunctions] = useState([]);
  const [empSelectedFunctions, setEmpSelectedFunctions] = useState([]);
  const [functionSearch, setFunctionSearch] = useState("");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState(EMPTY_FILES);

  const history = useHistory();

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchLiabilityTracker());
    }
  }, [dispatch, date, data]);

  useEffect(() => {
    if (error) NotificationManager.error(error);
  }, [error]);

  const allFilesAttached = useMemo(() => {
    return !!files.headcount && !!files.leaveTaken && !!files.sapLeaveBalance && !!files.baseRates;
  }, [files]);

  const allFunctions = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const funcSet = new Set();
    data.forEach((item) => {
      if (item.function) funcSet.add(item.function);
    });
    return Array.from(funcSet).sort();
  }, [data]);

  const filteredFunctions = useMemo(() => {
    if (!functionSearch.trim()) return allFunctions;
    return allFunctions.filter((f) =>
      f.toLowerCase().includes(functionSearch.toLowerCase())
    );
  }, [allFunctions, functionSearch]);

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

  const departmentData = useMemo(() => {
    const agg = {};
    deptFilteredData.forEach((item) => {
      const dept = item.organizationalUnit || "Unknown";
      const days = Number(item.balanceDays) || 0;
      agg[dept] = (agg[dept] || 0) + days;
    });

    return Object.entries(agg)
      .map(([name, totalDays]) => ({ name, totalDays }))
      .sort((a, b) => b.totalDays - a.totalDays)
      .slice(0, 50);
  }, [deptFilteredData]);

  const employeeData = useMemo(() => {
    return [...empFilteredData]
      .sort((a, b) => (Number(b.liabilityAmount) || 0) - (Number(a.liabilityAmount) || 0))
      .slice(0, 50)
      .map((emp) => ({
        name: emp.employeeName || "Unknown",
        liabilityAmount: Number(emp.liabilityAmount) || 0,
        employeeId: emp.employeeId,
        function: emp.function || "Unknown",
        organizationalUnit: emp.organizationalUnit,
      }));
  }, [empFilteredData]);

  const uniqueFunctionsInChart = useMemo(() => {
    const funcs = new Set();
    employeeData.forEach((item) => {
      if (item.function) funcs.add(item.function);
    });
    return Array.from(funcs).sort();
  }, [employeeData]);

  const handleFileChange = (key) => (e) => {
    setFiles((prev) => ({
      ...prev,
      [key]: e.target.files?.[0] || null,
    }));
  };

  const resetUploadModal = () => {
    setFiles(EMPTY_FILES);
    setUploading(false);
    setUploadOpen(false);
  };

  const handleUploadAndRecalculate = async () => {
    if (!allFilesAttached || uploading) return;

    try {
      setUploading(true);

      // Required order:
      // 1) Headcount
      await uploadSingleFile("headcount/upload", files.headcount);

      // 2) Leave Taken
      await uploadSingleFile("leavetaken/upload", files.leaveTaken);

      // 3) SAP Leave Balance
      await uploadSingleFile("leavebalance/upload", files.sapLeaveBalance);

      // 4) Base Rates
      await uploadSingleFile("baserates/upload", files.baseRates);

      // Auto calculate
      await axios.post(`${API_BASE_URL}liability/calculate`);

      NotificationManager.success(
        "Files uploaded successfully and liabilities recalculated."
      );

      // Refresh graphs
      await dispatch(fetchLiabilityTracker());

      resetUploadModal();
    } catch (err) {
      const msg = err?.response?.data || err.message || "Upload failed";
      NotificationManager.error(typeof msg === "string" ? msg : "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="liability-graphs-root">
      <div className="dashboard-controls">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="controls-left" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<i className="icon-chart" />}
              onClick={() => history.push("/app/dashboard/liability-tracker")}
              style={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Show Detailed Analysis
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => setUploadOpen(true)}
              style={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      <h2>Liability Graphs</h2>

      <div className="graph-container">
        <h3>Department Liability (Top 50 by Total Balance Days)</h3>

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
        {!loading && departmentData.length === 0 && <div>No department data available.</div>}
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

      <div className="graph-container" style={{ marginTop: 40 }}>
        <h3>Employee Liability (Top 50 by Liability Amount)</h3>

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
        {!loading && employeeData.length === 0 && <div>No employee data available.</div>}
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

            {uniqueFunctionsInChart.length > 0 && (
              <div className="function-legend">
                <h4>Function Colors</h4>
                <div className="legend-items">
                  {uniqueFunctionsInChart.map((func) => (
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

      {/* Upload Modal */}
      <Dialog
        open={uploadOpen}
        onClose={() => !uploading && resetUploadModal()}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Leave Tracker Files</DialogTitle>
        <DialogContent dividers>
          {uploading && <LinearProgress style={{ marginBottom: 16 }} />}

          <Typography variant="body2" style={{ marginBottom: 16 }}>
            Upload the files in the required flow. Leave Taken must be uploaded before SAP Leave Balance.
          </Typography>

          <div className="upload-field">
            <label>1. Headcount</label>
            <input type="file" onChange={handleFileChange("headcount")} />
            {files.headcount && <small>{files.headcount.name}</small>}
          </div>

          <div className="upload-field">
            <label>2. Leave Taken</label>
            <input type="file" onChange={handleFileChange("leaveTaken")} />
            {files.leaveTaken && <small>{files.leaveTaken.name}</small>}
          </div>

          <div className="upload-field">
            <label>3. SAP Leave Balance</label>
            <input type="file" onChange={handleFileChange("sapLeaveBalance")} />
            {files.sapLeaveBalance && <small>{files.sapLeaveBalance.name}</small>}
          </div>

          <div className="upload-field">
            <label>4. Base Rates</label>
            <input type="file" onChange={handleFileChange("baseRates")} />
            {files.baseRates && <small>{files.baseRates.name}</small>}
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={resetUploadModal}
            disabled={uploading}
            style={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadAndRecalculate}
            disabled={!allFilesAttached || uploading}
            style={{ textTransform: "none" }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

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
        .upload-field {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .upload-field label {
          font-weight: 600;
          color: #1f2937;
        }
        .upload-field small {
          color: #6b7280;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}