// LiabilityTracker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiabilityTracker } from "../../../Store/Actions/liabilityActions";
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
/*
  Usage:
    <LiabilityTracker />  // optional: <LiabilityTracker date="2026-01-22" />
*/

const COLUMNS = [
  { key: "employeeId", label: "Employee ID", group: "Employee" },
  { key: "employeeName", label: "Name", group: "Employee" },
  { key: "position", label: "Position", group: "Employee" },

  { key: "payCategory", label: "Pay Category", group: "Work" },
  { key: "organizationalUnit", label: "Organisational Unit", group: "Work" },
  { key: "function", label: "Function", group: "Work" },
  { key: "location", label: "Location", group: "Work" },
  { key: "businessUnit", label: "Business Unit", group: "Work" },
  { key: "nextAnniversaryDate", label: "Next Anniversary", group: "Work" },
  { key: "managerName", label: "Manager", group: "Work" },
  { key: "weeklyHours", label: "Weekly Hours", group: "Work" },

  // liability columns
  { key: "balanceDays", label: "Balance Days", group: "Liability" },
  { key: "entitlementDays", label: "Entitlement", group: "Liability" },
  { key: "totalLeaveBalance", label: "Total Balance", group: "Liability" },
  { key: "futureLeaveBookedDays", label: "Future Booked", group: "Liability" },
  { key: "targetDays", label: "Target Days", group: "Liability" },
  { key: "daysLeftToTake", label: "Days Left", group: "Liability" },
  { key: "dailyRate", label: "Daily Rate", group: "Liability" },
  { key: "liabilityAmount", label: "Liability Amount", group: "Liability" },
  { key: "benefitDays", label: "Benefit Days", group: "Liability" },
  { key: "benefitAmount", label: "Benefit Amount", group: "Liability" }
];

const LOCALSTORAGE_KEY = "liability_tracker_visible_cols_v1";
const DEFAULT_VISIBLE = COLUMNS.map(c => c.key);

function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(/,/g, ""));
  if (isNaN(n)) return value;
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatDate(value) {
  if (!value) return "";
  if (typeof value === "string" && value.startsWith && value.startsWith("0001")) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

export default function LiabilityTracker({ date = null }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, data, error } = useSelector((state) => state.liabilities || { loading: false, data: [], error: null });

  // UI state
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "liabilityAmount", dir: "desc" });
  const [pageSize, setPageSize] = useState(100);
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_VISIBLE;
  });
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    dispatch(fetchLiabilityTracker(date));
  }, [dispatch, date]);

  useEffect(() => {
    if (error) NotificationManager.error(error);
  }, [error]);

  // Filter + sort
  const filtered = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const q = (query || "").trim().toLowerCase();
    let list = data;
    if (q) {
      list = list.filter(item => {
        return (
          (item.employeeName || "").toString().toLowerCase().includes(q) ||
          (item.position || "").toString().toLowerCase().includes(q) ||
          (String(item.employeeId) || "").toLowerCase().includes(q) ||
          (item.organizationalUnit || "").toString().toLowerCase().includes(q) ||
          (item.function || "").toString().toLowerCase().includes(q)
        );
      });
    }
    const { key, dir } = sortBy;
    list = [...list].sort((a, b) => {
      const va = a?.[key] ?? "";
      const vb = b?.[key] ?? "";
      // numeric compare
      const na = typeof va === "number" ? va : parseFloat(String(va).replace(/,/g, "")) ;
      const nb = typeof vb === "number" ? vb : parseFloat(String(vb).replace(/,/g, "")) ;
      if (!isNaN(na) && !isNaN(nb)) {
        return dir === "asc" ? na - nb : nb - na;
      }
      // fallback string
      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return list;
  }, [data, query, sortBy]);

  // pagination
  useEffect(() => {
    setPage(1); // reset to first on filter change
  }, [query, pageSize, visibleCols, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(colKey) {
    setSortBy(prev => {
      if (prev.key === colKey) return { key: colKey, dir: prev.dir === "asc" ? "desc" : "asc" };
      return { key: colKey, dir: "desc" };
    });
  }

  function toggleCol(key) {
    setVisibleCols(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }

  function resetColumns() {
    try { localStorage.removeItem(LOCALSTORAGE_KEY); } catch (e) {}
    setVisibleCols(DEFAULT_VISIBLE);
  }

  function downloadCsv(useVisible = false) {
    const src = data || [];
    if (!src.length) {
      NotificationManager.info("No data to export");
      return;
    }
    const cols = useVisible ? COLUMNS.filter(c => visibleCols.includes(c.key)) : COLUMNS;
    const headers = cols.map(c => `"${c.label.replace(/"/g, '""')}"`).join(",");
    const rows = src.map(item => {
      return cols.map(col => {
        let v = item[col.key];
        if (v === null || v === undefined) return '""';
        if (typeof v === "number") v = v.toString();
        if (col.key.toLowerCase().includes("date")) v = formatDate(String(v));
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

  // Aggregations
  const totals = useMemo(() => {
    const t = { liabilityAmount: 0, dailyRateSum: 0, dailyRateCount: 0, employees: 0 };
    for (const r of filtered) {
      const la = Number(r?.liabilityAmount) || parseFloat(String(r?.liabilityAmount || "0").replace(/,/g, "")) || 0;
      t.liabilityAmount += la;
      const dr = Number(r?.dailyRate) || parseFloat(String(r?.dailyRate || "0").replace(/,/g, "")) || 0;
      if (!isNaN(dr) && dr !== 0) { t.dailyRateSum += dr; t.dailyRateCount += 1; }
      t.employees += 1;
    }
    return {
      liabilityAmount: t.liabilityAmount,
      avgDailyRate: t.dailyRateCount ? t.dailyRateSum / t.dailyRateCount : 0,
      employees: t.employees
    };
  }, [filtered]);

  // group header calculation for multi-row header
  const groups = useMemo(() => {
    const order = COLUMNS.map(c => c.key);
    const grouped = [];
    let cur = null;
    for (const colKey of order) {
      const col = COLUMNS.find(c => c.key === colKey);
      if (!col) continue;
      if (!cur || cur.name !== col.group) {
        cur = { name: col.group || "", keys: [col.key] };
        grouped.push(cur);
      } else {
        cur.keys.push(col.key);
      }
    }
    return grouped;
  }, []);

  return (
    <div className="liability-tracker-root" role="region" aria-label="Liability tracker">
      {/* Toolbar */}
      <div className="lt-toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconButton onClick={() => history.goBack()}><ArrowBack /></IconButton>
          <h3 style={{ margin: 0 }}>Liability Tracker</h3>
          <button className="btn" onClick={() => dispatch(fetchLiabilityTracker(date))} disabled={loading}>Refresh</button>
          <button className="btn" onClick={() => downloadCsv(false)}>Export CSV (All cols)</button>
          <button className="btn" onClick={() => downloadCsv(true)}>Export CSV (Visible)</button>
        </div>

        <div className="lt-controls">
          <input
            type="text"
            placeholder="Search name, position, department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="lt-search"
            aria-label="Search liabilities"
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

      {/* KPI strip */}
      <div className="kpi-strip" role="list" aria-label="Key metrics">
        <div className="kpi-card" role="listitem">
          <div className="kpi-label">Total Liability</div>
          <div className="kpi-value">AUD {formatNumber(totals.liabilityAmount, 2)}</div>
        </div>
        <div className="kpi-card" role="listitem">
          <div className="kpi-label">Avg Daily Rate</div>
          <div className="kpi-value">AUD {formatNumber(totals.avgDailyRate, 2)}</div>
        </div>
        <div className="kpi-card" role="listitem">
          <div className="kpi-label">Employees</div>
          <div className="kpi-value">{totals.employees}</div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn" onClick={() => { setVisibleCols(DEFAULT_VISIBLE); try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(DEFAULT_VISIBLE)); } catch(e){} }}>Show All</button>
          <button className="btn" onClick={resetColumns}>Reset Columns</button>
        </div>
      </div>

      {/* Column toggles */}
      <div className="col-toggles" aria-hidden={false}>
        {COLUMNS.map(c => (
          <label key={c.key} className="col-toggle">
            <input type="checkbox" checked={visibleCols.includes(c.key)} onChange={() => toggleCol(c.key)} />
            <span>{c.label}</span>
          </label>
        ))}
      </div>

      {/* Table wrapper */}
      <div className="lt-table-wrapper">
        <table className="lt-table" role="table" aria-label="Liabilities table">
          <thead>
            {/* Group header row */}
            <tr>
              {groups.map(g => {
                // count only visible keys within this group
                const visibleCount = g.keys.filter(k => visibleCols.includes(k)).length;
                if (visibleCount === 0) return null;
                return (
                  <th key={g.name} className="group-th" colSpan={visibleCount} aria-hidden="true">{g.name}</th>
                );
              })}
            </tr>

            {/* Column headers */}
            <tr>
              {COLUMNS.filter(c => visibleCols.includes(c.key)).map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`lt-th ${col.key === "employeeId" ? "sticky-first-col" : ""}`}
                  scope="col"
                  role="columnheader"
                  aria-sort={sortBy.key === col.key ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{col.label}</span>
                    {sortBy.key === col.key ? <span className="sort-indicator" aria-hidden>{sortBy.dir === "asc" ? "▲" : "▼"}</span> : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={visibleCols.length} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={visibleCols.length} style={{ textAlign: "center", padding: 20 }}>No data</td></tr>
            ) : visible.map((row, rowIndex) => (
              <tr key={row.employeeId ?? rowIndex} tabIndex={0} onClick={() => setSelectedRow(row)}>
                {COLUMNS.filter(c => visibleCols.includes(c.key)).map(col => {
                  const v = row[col.key];
                  // numeric financial columns
                  if (["dailyRate", "liabilityAmount", "benefitAmount"].includes(col.key)) {
                    return <td key={col.key} style={{ textAlign: "right", whiteSpace: "nowrap" }}>{formatNumber(v, 2)}</td>;
                  }
                  // numeric integer-ish columns
                  if (["weeklyHours", "balanceDays", "entitlementDays", "targetDays", "daysLeftToTake", "benefitDays", "futureLeaveBookedDays"].includes(col.key)) {
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

          {/* footer with totals */}
          <tfoot>
            <tr className="totals-row">
              {COLUMNS.filter(c => visibleCols.includes(c.key)).map((col, i) => {
                if (col.key === "employeeName") {
                  return <td key={col.key}><strong>Totals / Averages</strong></td>;
                }
                if (col.key === "liabilityAmount") {
                  return <td key={col.key} style={{ textAlign: "right", whiteSpace: "nowrap" }}><strong>{formatNumber(totals.liabilityAmount, 2)}</strong></td>;
                }
                if (col.key === "dailyRate") {
                  return <td key={col.key} style={{ textAlign: "right", whiteSpace: "nowrap" }}><strong>{formatNumber(totals.avgDailyRate, 2)}</strong></td>;
                }
                // otherwise blank cell
                return <td key={col.key} />;
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <div>
          <small>Showing {Math.min(filtered.length, (page - 1) * pageSize + 1)} - {Math.min(filtered.length, page * pageSize)} of {filtered.length} rows</small>
        </div>
        <div className="page-controls">
          <button className="btn" onClick={() => setPage(1)} disabled={page === 1}>« First</button>
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
          <span>Page</span>
          <input type="number" value={page} min={1} max={pageCount} onChange={(e) => {
            const v = parseInt(e.target.value || "1");
            if (!isNaN(v)) setPage(Math.min(Math.max(1, v), pageCount));
          }} style={{ width: 60 }} />
          <span>of {pageCount}</span>
          <button className="btn" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next ›</button>
          <button className="btn" onClick={() => setPage(pageCount)} disabled={page === pageCount}>Last »</button>
        </div>
      </div>

      {/* Selected row flyout */}
      {selectedRow && (
        <aside className="flyout" role="dialog" aria-label={`Details for ${selectedRow.employeeName || selectedRow.employeeId}`}>
          <div className="flyout-header">
            <h3>{selectedRow.employeeName || "Employee" } <small>{selectedRow.employeeId ? `(${selectedRow.employeeId})` : ""}</small></h3>
            <div>
              <button className="btn" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(selectedRow)); NotificationManager.info("Copied JSON to clipboard"); }}>Copy JSON</button>
              <button className="btn primary" onClick={() => setSelectedRow(null)} style={{ marginLeft: 8 }}>Close</button>
            </div>
          </div>
          <div className="flyout-body">
            <dl>
              {COLUMNS.map(c => (
                <div key={c.key} className="flyout-row">
                  <dt>{c.label}</dt>
                  <dd>
                    {c.key.toLowerCase().includes("date") ? formatDate(String(selectedRow[c.key] || "")) :
                      (["dailyRate", "liabilityAmount", "benefitAmount"].includes(c.key)
                        ? (selectedRow[c.key] !== undefined ? `AUD ${formatNumber(selectedRow[c.key], 2)}` : "")
                        : (selectedRow[c.key] ?? ""))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      )}

      <style jsx>{`
        .liability-tracker-root { padding: 12px; font-family: Inter, "Segoe UI", Roboto, sans-serif; color: #1f2937; }
        .lt-toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:8px; }
        .lt-controls { display:flex; align-items:center; gap:8px; }
        .lt-search { padding:6px 8px; width:320px; border-radius:6px; border:1px solid #ddd; }
        .btn { padding:8px 12px; border-radius:6px; border:1px solid #ccc; background:#fff; cursor:pointer; }
        .btn.primary { background:#0b74de; color:#fff; border-color:#0b74de; }
        .lt-table-wrapper { overflow:auto; border:1px solid #eee; border-radius:6px; margin-top:8px; }
        .lt-table { border-collapse:collapse; width:100%; min-width:1200px; }
        .lt-table thead th { position: sticky; top:0; background:#f8f9fb; text-align:left; padding:10px; border-bottom:1px solid #e6e9ee; font-weight:600; z-index:2; }
        .lt-table thead .group-th { top: 40px; background:#eef2f7; font-weight:700; padding:8px 10px; border-bottom:1px solid #e6e9ee; }
        .lt-table tbody td { padding:10px; border-bottom:1px solid #f0f2f5; font-size:13px; color:#222; }
        .lt-table tbody tr:hover { background:#fafcff; cursor: pointer; }
        .sort-indicator { font-size:10px; color:#666; }
        .sticky-first-col { position: sticky; left: 0; background: #fff; z-index:3; box-shadow: 2px 0 6px rgba(0,0,0,0.03); }
        .lt-table thead th.sticky-first-col { z-index:4; }
        .col-toggles { margin-top:8px; display:flex; gap:12px; flex-wrap:wrap; padding:6px 8px; background:#fafafa; border-radius:6px; border:1px solid #f0f0f0; }
        .col-toggle { display:flex; align-items:center; gap:6px; font-size:13px; }
        .kpi-strip { display:flex; gap:12px; margin-top:12px; align-items:center; }
        .kpi-card { padding:10px 12px; border-radius:8px; background:#fff; border:1px solid #eee; min-width:160px; }
        .kpi-label { font-size:12px; color:#666; }
        .kpi-value { font-size:18px; font-weight:700; margin-top:4px; }
        .pagination { display:flex; justify-content:space-between; align-items:center; margin-top:10px; gap:12px; }
        .page-controls { display:flex; gap:8px; align-items:center; }
        .flyout { position: fixed; right: 20px; top: 80px; width: 420px; max-height: calc(100vh - 120px); background: #fff; border: 1px solid #e6e9ee; box-shadow: 0 10px 30px rgba(16,24,40,0.12); border-radius:8px; z-index: 9999; display:flex; flex-direction:column; }
        .flyout-header { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-bottom:1px solid #f0f2f5; }
        .flyout-body { overflow:auto; padding:12px 14px; }
        .flyout-row { display:flex; gap:8px; padding:6px 0; border-bottom:1px dashed #f4f6f8; }
        .flyout-row dt { width: 160px; color:#555; font-weight:600; }
        .flyout-row dd { margin: 0; flex: 1; color:#111; }
        .totals-row td { background:#fafafa; font-weight:600; padding:10px; border-top:2px solid #eee; }
      `}</style>
    </div>
  );
}
