import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./AdminCompaniesPage.css"; // import custom styles

const API_BASE = process.env.REACT_APP_BASE_URL || "http://localhost:5228";
const api = axios.create({ baseURL: API_BASE });

// Toast notifications component
function Toast({ messages, onClose }) {
  return (
    <div className="toast-container">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`toast-item ${m.type === "error" ? "toast-error" : "toast-info"}`}
          onClick={() => onClose(m.id)}
          role="status"
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}

// Confirmation modal component
function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = "Confirm" }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-btn modal-btn-cancel">Cancel</button>
          <button onClick={onConfirm} className="modal-btn modal-btn-confirm">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const part = token.split(".")[1];
    if (!part) return null;

    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json);
  } catch (err) {
    console.error("Failed to decode JWT payload:", err);
    return null;
  }
}

function storeImpersonationSession(token) {
  const payload = decodeJwtPayload(token) || {};

  const userId = payload.userId ?? payload.UserId ?? "";
  const companyId = payload.companyId ?? payload.CompanyId ?? "";
  const access = payload.access ?? payload.Access ?? "";
  const businessUnit = payload.businessUnit ?? payload.BusinessUnit ?? "";

  localStorage.setItem("token", token);
  localStorage.setItem("userId", String(userId));
  localStorage.setItem("companyId", String(companyId));
  localStorage.setItem("access", String(access));
  localStorage.setItem("BusinessUnit", String(businessUnit));
  localStorage.setItem("isImpersonation", "1");

  // optional: keep a single-source current user object
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      token,
      userId: String(userId),
      companyId: String(companyId),
      access: String(access),
      BusinessUnit: String(businessUnit),
    })
  );

  return payload;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef(null);

  const [companyPage, setCompanyPage] = useState(1);
  const companiesPerPage = 12;

  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 10;

  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmPayload = useRef({ companyId: null, userId: null, currentlyActive: false });

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const resetPayload = useRef({ companyId: null, userId: null, userEmail: null });

  // Debounce search input
  useEffect(() => {
    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current);
    }
    searchTimer.current = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCompanyPage(1);
    }, 300);
    return () => {
      if (searchTimer.current) window.clearTimeout(searchTimer.current);
    };
  }, [search]);

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (selectedCompanyId) fetchUsers(selectedCompanyId);
    else setCompanyUsers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  // Toast helpers
  function pushToast(text, type = "info", ttl = 4000) {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), ttl);
  }
  function removeToast(id) {
    setToasts((t) => t.filter(x => x.id !== id));
  }

  async function fetchCompanies() {
    try {
      setLoadingCompanies(true);
      setError(null);
      const res = await api.get("admin/companies");
      const data = res.data || [];
      const filtered = debouncedSearch
        ? data.filter(c => {
          const s = debouncedSearch.toLowerCase();
          return (
            (c.companyName || "").toLowerCase().includes(s) ||
            (c.contactNumber || "").toLowerCase().includes(s) ||
            (c.location || "").toLowerCase().includes(s)
          );
        })
        : data;
      setCompanies(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load companies.");
      pushToast("Failed to load companies", "error");
    } finally {
      setLoadingCompanies(false);
    }
  }

  async function fetchUsers(companyId) {
    try {
      setLoadingUsers(true);
      setError(null);
      setUserPage(1);
      const res = await api.get(`admin/companies/${companyId}/users`);
      setCompanyUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users for company.");
      pushToast("Failed to load users", "error");
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleImpersonateCompany(companyId) {
    try {
      const res = await api.post(`superadmin/impersonate`, { companyId });

      const token = res.data?.token || res.data?.Token;
      const url = res.data?.impersonationUrl || res.data?.ImpersonationUrl;

      if (token) {
        const payload = storeImpersonationSession(token);
        console.log("Impersonation claims:", payload);
      }

      if (url) {
        window.open(url, "_blank");
        pushToast("Impersonation opened in new tab", "info");
      } else {
        setError("Impersonation failed: no url returned.");
        pushToast("Impersonation failed", "error");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Impersonation failed.";
      setError(msg);
      pushToast(msg, "error");
    }
  }

  async function handleImpersonateUser(companyId, userId) {
    try {
      const res = await api.post(`superadmin/impersonate`, { companyId, userId });

      const token = res.data?.token || res.data?.Token;
      const url = res.data?.impersonationUrl || res.data?.ImpersonationUrl;

      if (token) {
        const payload = storeImpersonationSession(token);
        console.log("Impersonation claims:", payload);
      }

      if (url) {
        window.open(url, "_blank");
        pushToast("Impersonation opened in new tab", "info");
      } else {
        setError("Impersonation failed: no url returned.");
        pushToast("Impersonation failed", "error");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Impersonation failed.";
      setError(msg);
      pushToast(msg, "error");
    }
  }

  function confirmToggleUser(companyId, userId, currentlyActive) {
    confirmPayload.current = { companyId, userId, currentlyActive };
    setConfirmOpen(true);
  }

  async function performToggleConfirmed() {
    const { companyId, userId, currentlyActive } = confirmPayload.current;
    setConfirmOpen(false);
    try {
      await api.post(`admin/companies/${companyId}/users/${userId}/toggle-active`);
      setCompanyUsers(prev =>
        prev.map(u => (u.userId === userId ? { ...u, isActive: !currentlyActive } : u))
      );
      pushToast(currentlyActive ? "User disabled" : "User enabled");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to toggle user active state.";
      setError(msg);
      pushToast(msg, "error");
    }
  }

  function requestResetUserPassword(companyId, userId, userEmail) {
    resetPayload.current = { companyId, userId, userEmail };
    setResetConfirmOpen(true);
  }

  async function performResetConfirmed() {
    const { companyId, userId, userEmail } = resetPayload.current;
    setResetConfirmOpen(false);
    try {
      await api.post(`admin/companies/${companyId}/users/${userId}/reset-password`);
      pushToast(`Password reset email sent to ${userEmail || "user"}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to trigger password reset.";
      setError(msg);
      pushToast(msg, "error");
    }
  }

  function exportUsersCsv() {
    if (!companyUsers || companyUsers.length === 0) {
      pushToast("No users to export", "error");
      return;
    }
    const rows = [
      ["Employee#", "FirstName", "LastName", "Email", "Role", "Active", "Contact", "Location"]
    ];
    companyUsers.forEach(u => {
      rows.push([
        u.employeeNumber ?? "",
        u.firstName ?? "",
        u.lastName ?? "",
        u.email ?? "",
        u.accessLevel ?? "",
        u.isActive ? "Yes" : "No",
        u.contactNumber ?? "",
        u.location ?? ""
      ]);
    });
    const csvContent = rows
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${selectedCompanyId || "company"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    pushToast("CSV exported");
  }

  const companyTotalPages = Math.max(1, Math.ceil(companies.length / companiesPerPage));
  const visibleCompanies = useMemo(() => {
    const start = (companyPage - 1) * companiesPerPage;
    return companies.slice(start, start + companiesPerPage);
  }, [companies, companyPage]);

  const userTotalPages = Math.max(1, Math.ceil(companyUsers.length / usersPerPage));
  const visibleUsers = useMemo(() => {
    const start = (userPage - 1) * usersPerPage;
    return companyUsers.slice(start, start + usersPerPage);
  }, [companyUsers, userPage]);

  return (
    <div className="admin-page">
      <Toast messages={toasts} onClose={removeToast} />

      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1 className="page-title">Super Admin — Companies</h1>
            <p className="page-description">
              Manage companies, view users, and impersonate tenant sessions
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => {
                fetchCompanies();
                pushToast("Refreshing companies");
              }}
              className="btn-refresh"
            >
              Refresh
            </button>
            {/* <button
              onClick={() => {}}
              className="btn-settings"
            >
              Settings
            </button> */}
          </div>
        </header>

        <div className="companies-grid">
          {/* Companies list */}
          <aside className="companies-sidebar">
            <div className="search-wrapper">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search companies by name, contact, or location"
                className="search-input"
                aria-label="Search companies"
              />
            </div>

            <div className="companies-list">
              {loadingCompanies ? (
                <div className="loading-placeholder">Loading companies...</div>
              ) : visibleCompanies.length === 0 ? (
                <div className="loading-placeholder">No companies found.</div>
              ) : (
                <ul>
                  {visibleCompanies.map(c => (
                    <li
                      key={c.companyId}
                      onClick={() => {
                        setSelectedCompanyId(c.companyId);
                        setUserPage(1);
                      }}
                      className={`company-item ${selectedCompanyId === c.companyId ? "company-item-selected" : ""
                        }`}
                      role="button"
                      tabIndex={0}
                    >
                      <div>
                        <div className="company-name">{c.companyName}</div>
                        <div className="company-details">
                          {c.contactNumber || "—"} • {c.location || "—"}
                        </div>
                      </div>
                      {/* <div className="company-actions">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleImpersonateCompany(c.companyId);
                          }}
                          className="btn-impersonate"
                        >
                          Impersonate
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                          }}
                          className="btn-edit"
                        >
                          Edit
                        </button>
                      </div> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="page-info">
                Page {companyPage} / {companyTotalPages}
              </div>
              <div className="pagination-controls">
                <button
                  disabled={companyPage <= 1}
                  onClick={() => setCompanyPage(p => Math.max(1, p - 1))}
                  className={`page-btn ${companyPage <= 1 ? "page-btn-disabled" : ""}`}
                >
                  Prev
                </button>
                <button
                  disabled={companyPage >= companyTotalPages}
                  onClick={() => setCompanyPage(p => Math.min(companyTotalPages, p + 1))}
                  className={`page-btn ${companyPage >= companyTotalPages ? "page-btn-disabled" : ""}`}
                >
                  Next
                </button>
              </div>
            </div>
          </aside>

          {/* Company details & users */}
          <main className="company-details-panel">
            {!selectedCompanyId ? (
              <div className="panel-placeholder">Select a company to view users</div>
            ) : (
              <>
                <div className="panel-header">
                  <h2 className="panel-title">Users</h2>
                  <div className="panel-actions">
                    <button
                      onClick={() => fetchUsers(selectedCompanyId)}
                      className="btn-refresh"
                    >
                      Refresh
                    </button>
                    {/* <button
                      onClick={() => {}}
                      className="btn-create"
                    >
                      Create user
                    </button> */}
                    <button
                      onClick={exportUsersCsv}
                      className="btn-export"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>

                {loadingUsers ? (
                  <div className="loading-placeholder">Loading users...</div>
                ) : companyUsers.length === 0 ? (
                  <div className="loading-placeholder">No users found for this company.</div>
                ) : (
                  <>
                    <div className="user-table-wrapper">
                      <table className="user-table">
                        <thead>
                          <tr className="user-table-header">
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Active</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleUsers.map(u => (
                            <tr key={u.userId} className="user-row">
                              <td>{u.employeeNumber}</td>
                              <td>{u.firstName} {u.lastName}</td>
                              <td className="user-email">{u.email}</td>
                              <td>
                                <span className="role-badge">{u.accessLevel}</span>
                              </td>
                              <td>{u.isActive ? "Yes" : "No"}</td>
                              <td>
                                <div className="user-actions">
                                  <button
                                    onClick={() =>
                                      handleImpersonateUser(selectedCompanyId, u.userId)
                                    }
                                    className="btn-impersonate-small"
                                  >
                                    Impersonate
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmToggleUser(selectedCompanyId, u.userId, u.isActive)
                                    }
                                    className="btn-toggle"
                                  >
                                    {u.isActive ? "Disable" : "Enable"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      requestResetUserPassword(selectedCompanyId, u.userId, u.email)
                                    }
                                    className="btn-reset"
                                  >
                                    Reset pwd
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* User pagination */}
                    <div className="pagination">
                      <div className="page-info">{companyUsers.length} users</div>
                      <div className="pagination-controls">
                        <button
                          disabled={userPage <= 1}
                          onClick={() => setUserPage(p => Math.max(1, p - 1))}
                          className={`page-btn ${userPage <= 1 ? "page-btn-disabled" : ""}`}
                        >
                          Prev
                        </button>
                        <div className="page-info">
                          Page {userPage} / {userTotalPages}
                        </div>
                        <button
                          disabled={userPage >= userTotalPages}
                          onClick={() => setUserPage(p => Math.min(userTotalPages, p + 1))}
                          className={`page-btn ${userPage >= userTotalPages ? "page-btn-disabled" : ""}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {error && <div className="error-message">{String(error)}</div>}
          </main>
        </div>

        <footer className="admin-footer">
          Tip: impersonation opens a new tab so your SuperAdmin session remains active.
        </footer>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={confirmOpen}
        title="Confirm change"
        message="Are you sure you want to change this user's active state?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={performToggleConfirmed}
      />

      <ConfirmModal
        open={resetConfirmOpen}
        title="Send password reset"
        message={`Send password reset email to ${resetPayload.current.userEmail || "this user"}?`}
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={performResetConfirmed}
        confirmText="Send"
      />
    </div>
  );
}