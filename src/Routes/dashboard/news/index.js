// LiabilityTracker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiabilityTracker } from "../../../Store/Actions/liabilityActions";
import { NotificationManager } from "react-notifications";

/*
  Usage:
    <LiabilityTracker />  // optional: <LiabilityTracker date="2026-01-22" />
*/

const COLUMNS = [
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Name" },
  { key: "position", label: "Position" },
  { key: "payCategory", label: "Pay Category" },
  { key: "organizationalUnit", label: "Organisational Unit" },
  { key: "function", label: "Function" },
  { key: "location", label: "Location" },
  { key: "businessUnit", label: "Business Unit" },
  { key: "nextAnniversaryDate", label: "Next Anniversary" },
  { key: "managerName", label: "Manager" },
  { key: "weeklyHours", label: "Weekly Hours" },

  // liability columns
  { key: "balanceDays", label: "Balance Days" },
  { key: "entitlementDays", label: "Entitlement" },
  { key: "totalLeaveBalance", label: "Total Balance" },
  { key: "futureLeaveBookedDays", label: "Future Booked" },
  { key: "targetDays", label: "Target Days" },
  { key: "daysLeftToTake", label: "Days Left" },
  { key: "dailyRate", label: "Daily Rate" },
  { key: "liabilityAmount", label: "Liability Amount" },
  { key: "benefitDays", label: "Benefit Days" },
  { key: "benefitAmount", label: "Benefit Amount" }
];

function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  // try parse
  const n = parseFloat(value);
  if (isNaN(n)) return value;
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatDate(value) {
  if (!value) return "";
  // handle "0001-01-01T00:00:00" sentinel as blank
  if (value.startsWith && value.startsWith("0001")) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

export default function NewsDashboard({ date = null }) {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.liabilities || { loading: false, data: [], error: null });

  // local UI state
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "liabilityAmount", dir: "desc" });
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
    // fetch on mount
    dispatch(fetchLiabilityTracker(date));
  }, [dispatch, date]);

  useEffect(() => {
    if (error) NotificationManager.error(error);
  }, [error]);

  // filtered + sorted data
  const filtered = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const q = (query || "").trim().toLowerCase();
    let list = data;
    if (q) {
      list = list.filter(item => {
        return (
          (item.employeeName || "").toLowerCase().includes(q) ||
          (item.position || "").toLowerCase().includes(q) ||
          String(item.employeeId).includes(q) ||
          (item.organizationalUnit || "").toLowerCase().includes(q) ||
          (item.function || "").toLowerCase().includes(q)
        );
      });
    }
    // sort
    const { key, dir } = sortBy;
    list = [...list].sort((a, b) => {
      const va = a?.[key] ?? "";
      const vb = b?.[key] ?? "";
      // numeric sort if both are numbers
      if (typeof va === "number" && typeof vb === "number") {
        return dir === "asc" ? va - vb : vb - va;
      }
      // fallback string compare
      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return list;
  }, [data, query, sortBy]);

  const visible = filtered.slice(0, pageSize);

  function toggleSort(colKey) {
    setSortBy(prev => {
      if (prev.key === colKey) return { key: colKey, dir: prev.dir === "asc" ? "desc" : "asc" };
      return { key: colKey, dir: "desc" };
    });
  }

  function downloadCsv() {
    if (!data || !data.length) {
      NotificationManager.info("No data to export");
      return;
    }

    // Build CSV header same order as table columns
    const headers = COLUMNS.map(c => `"${c.label.replace(/"/g, '""')}"`).join(",");
    const rows = data.map(item => {
      return COLUMNS.map(col => {
        let v = item[col.key];
        if (v === null || v === undefined) return '""';
        // format numbers with plain decimal (no thousands) for csv clarity
        if (typeof v === "number") v = v.toString();
        // dates often serialized; format for readability
        if (col.key.toLowerCase().includes("date")) v = formatDate(String(v));
        // escape quotes
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(",");
    });
    const csv = [headers, ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `Liabilities_${new Date().toISOString().slice(0,10)}.csv`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    NotificationManager.success("Export complete");
  }

  return (
    <div className="liability-tracker-root">
      <div className="lt-toolbar">
        <div>
          <button className="btn primary" onClick={() => dispatch(fetchLiabilityTracker(date))} disabled={loading}>
            Refresh
          </button>
          <button className="btn" onClick={downloadCsv} style={{ marginLeft: 8 }}>
            Export CSV
          </button>
        </div>

        <div className="lt-controls">
          <input
            type="text"
            placeholder="Search name, position, department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="lt-search"
          />
          <label style={{ marginLeft: 12 }}>
            Rows:
            <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value || "100"))}>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={1000}>Show all</option>
            </select>
          </label>
        </div>
      </div>

      <div className="lt-table-wrapper">
        <table className="lt-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)} className="lt-th">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{col.label}</span>
                    {sortBy.key === col.key ? <span className="sort-indicator">{sortBy.dir === "asc" ? "▲" : "▼"}</span> : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={COLUMNS.length} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={COLUMNS.length} style={{ textAlign: "center", padding: 20 }}>No data</td></tr>
            ) : visible.map(row => (
              <tr key={row.employeeId}>
                {COLUMNS.map(col => {
                  const v = row[col.key];
                  // render formatting rules
                  if (col.key === "dailyRate" || col.key === "liabilityAmount" || col.key === "benefitAmount" || col.key === "futureLeaveBookedDays") {
                    return <td key={col.key} style={{ textAlign: "right", whiteSpace: "nowrap" }}>{formatNumber(v, 2)}</td>;
                  }
                  if (col.key === "weeklyHours" || col.key === "balanceDays" || col.key === "entitlementDays" || col.key === "targetDays" || col.key === "daysLeftToTake" || col.key === "benefitDays") {
                    return <td key={col.key} style={{ textAlign: "center", whiteSpace: "nowrap" }}>{v ?? ""}</td>;
                  }
                  if (col.key.toLowerCase().includes("date")) {
                    return <td key={col.key} style={{ whiteSpace: "nowrap" }}>{formatDate(String(v || ""))}</td>;
                  }
                  // default
                  return <td key={col.key} style={{ whiteSpace: "nowrap" }}>{v ?? ""}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8 }}>
        <small>Showing {visible.length} of {filtered.length} rows (filtered). Click column header to sort.</small>
      </div>

      {/* Inline CSS for convenience; move to your stylesheet */}
      <style jsx>{`
        .liability-tracker-root { padding: 12px; font-family: Inter, "Segoe UI", Roboto, sans-serif; }
        .lt-toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:8px; }
        .lt-controls { display:flex; align-items:center; gap:8px; }
        .lt-search { padding:6px 8px; width:320px; border-radius:6px; border:1px solid #ddd; }
        .btn { padding:8px 12px; border-radius:6px; border:1px solid #ccc; background:#fff; cursor:pointer; }
        .btn.primary { background:#0b74de; color:#fff; border-color:#0b74de; }
        .lt-table-wrapper { overflow-x:auto; border:1px solid #eee; border-radius:6px; }
        .lt-table { border-collapse:collapse; width:100%; min-width:1500px; }
        .lt-table thead th { position: sticky; top:0; background:#f8f9fb; text-align:left; padding:10px; border-bottom:1px solid #e6e9ee; font-weight:600; z-index:2; }
        .lt-table tbody td { padding:10px; border-bottom:1px solid #f0f2f5; font-size:13px; color:#222; }
        .lt-table tbody tr:hover { background:#fafcff; }
        .sort-indicator { font-size:10px; color:#666; }
      `}</style>
    </div>
  );
}
