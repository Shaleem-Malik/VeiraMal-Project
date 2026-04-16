import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5228";
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

export default function AuthImpersonate() {
  const [status, setStatus] = useState("starting"); // starting | working | error | done
  const [message, setMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function run() {
      setStatus("working");
      setMessage("");

      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (!token) {
          setMessage("Missing token in URL.");
          setStatus("error");
          return;
        }

        // Post token to server (cookie-based flow expected)
        const res = await api.post("/api/auth/impersonate/accept", { token }, { withCredentials: true });

        // Server might return:
        // { redirectUrl }  (cookie flow: server set cookie)
        // OR { token, redirectUrl } (JWT-return flow)
        const redirectUrl = res.data?.redirectUrl;
        const returnedToken = res.data?.token || res.data?.impersonationToken;

        if (returnedToken) {
          // JWT-return flow: store token (careful with XSS in production)
          localStorage.setItem("impersonation_token", returnedToken);
          // set Authorization header for subsequent requests (optional)
          axios.defaults.headers.common["Authorization"] = `Bearer ${returnedToken}`;
          window.location.replace(redirectUrl || "/app/dashboard");
          setStatus("done");
          return;
        }

        if (redirectUrl) {
          // cookie flow: server set cookie; redirect
          // small delay to ensure cookie is set
          setTimeout(() => window.location.replace(redirectUrl), 250);
          setStatus("done");
          return;
        }

        // If neither provided, treat as success and navigate to dashboard
        window.location.replace("/app/dashboard");
        setStatus("done");
      } catch (err) {
        console.error("Impersonation failed", err);
        const msg = err?.response?.data?.message || err?.message || "Impersonation failed.";
        setMessage(msg);
        setStatus("error");
      }
    }

    run();
  }, [retryCount]);

  function retry() {
    setRetryCount(c => c + 1);
    setStatus("starting");
    setMessage("");
  }

  return (
    <div style={{padding:24}} className="min-h-screen flex items-start justify-center pt-24">
      {status === "working" && (
        <div className="text-center">
          <div className="mb-2">Signing you in as tenant... please wait.</div>
          <div className="text-sm text-slate-500">If you're not redirected automatically, check browser console/network for errors.</div>
        </div>
      )}

      {status === "error" && (
        <div className="max-w-xl bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Impersonation failed</h3>
          <p className="text-sm text-red-600 mb-4">{message}</p>
          <div className="flex gap-2">
            <button onClick={retry} className="px-3 py-2 rounded border">Retry</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Copied URL to clipboard"); }} className="px-3 py-2 rounded bg-slate-800 text-white">Copy URL</button>
          </div>
        </div>
      )}

      {status === "done" && (
        <div className="text-center">
          <div>Redirecting...</div>
        </div>
      )}
    </div>
  );
}