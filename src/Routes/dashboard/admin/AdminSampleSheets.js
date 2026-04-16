import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSampleSheets.css"; // keep your custom styles if present

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5228";
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

const SHEETS = [
  { key: "headcounts", label: "Headcounts" },
  { key: "nhts", label: "NHTs" },
  { key: "terms", label: "Terms" },
  { key: "baserates", label: "Base Rates" },
  { key: "sapleavebalance", label: "SAP Leave Balance" },
  { key: "leavetaken", label: "Leave Taken" }
];

export default function AdminSampleSheets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/samples");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load sample sheets." });
    } finally {
      setLoading(false);
    }
  }

  function getItemForKey(key) {
    return items.find(i => i.key === key) || { key, displayName: SHEETS.find(s => s.key === key)?.label, exists: false };
  }

  function downloadUrlFor(item) {
    return `${API_BASE}/api/admin/samples/${item.key}/download`;
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadingKey) return setMessage({ type: "error", text: "Select a sheet to upload." });
    if (!file) return setMessage({ type: "error", text: "Select a file to upload." });

    const fd = new FormData();
    fd.append("key", uploadingKey);
    fd.append("file", file);

    try {
      setMessage({ type: "info", text: "Uploading..." });
      const res = await api.post("/api/admin/samples/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage({ type: "success", text: `${res.data.displayName} uploaded.` });
      setFile(null);
      setUploadingKey(null);
      await fetchList();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Upload failed" });
    }
  }

  return (
    <div className="sample-sheets-container">
      <h2 className="sample-sheets-title">Sample Sheets</h2>

      <div className="sheets-grid">
        {SHEETS.map(s => {
          const item = getItemForKey(s.key);
          return (
            <div key={s.key} className="sheet-card">
              <div>
                <div className="sheet-label">{s.label}</div>
                <div className="sheet-timestamp">
                  {item.exists
                    ? `Uploaded: ${item.updatedAtUtc ? new Date(item.updatedAtUtc).toLocaleString() : "unknown"}`
                    : "No sample uploaded"}
                </div>
              </div>
              <div className="sheet-actions">
                {item.exists && (
                  <a
                    href={downloadUrlFor(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-download"
                  >
                    Download
                  </a>
                )}
                <button
                  onClick={() => { setUploadingKey(s.key); setFile(null); }}
                  className="btn-upload-update"
                >
                  {item.exists ? "Update" : "Upload"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleUpload} className="upload-form">
        <div className="form-row">
          <select
            value={uploadingKey || ""}
            onChange={e => setUploadingKey(e.target.value)}
            className="select-sheet"
          >
            <option value="">Select sample sheet...</option>
            {SHEETS.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="file-input"
          />

          <button type="submit" className="btn-submit-upload">
            Upload
          </button>
        </div>

        {message && (
          <div className={`message ${message.type === "error" ? "message-error" : "message-success"}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}