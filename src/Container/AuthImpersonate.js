import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BASE_URL || "http://localhost:5228";
const api = axios.create({ baseURL: API_BASE });

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
  } catch {
    return null;
  }
}

function normalizeRedirectUrl(redirectUrl) {
  if (!redirectUrl) return null;

  try {
    const url = new URL(redirectUrl, window.location.origin);

    // force production origin if backend accidentally sends localhost
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return `${window.location.origin}${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    if (redirectUrl.startsWith("/")) {
      return `${window.location.origin}${redirectUrl}`;
    }
    return redirectUrl;
  }
}

function routeBasedOnAccess(access) {
  const normalized = (access || "").toString().toLowerCase();

  if (normalized === "superadmin" || normalized === "super_admin" || normalized === "super-admin") {
    return "/app/dashboard/admin";
  }
  if (normalized === "ceo" || normalized === "hr") {
    return "/app/crm/dashboard";
  }
  if (normalized === "team manager" || normalized === "teammanager" || normalized === "team_manager") {
    return "/app/dashboard/saas";
  }
  return "/app/dashboard/ecommerce";
}

export default function AuthImpersonate() {
  const [status, setStatus] = useState("starting");
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

        const res = await api.post("auth/impersonate/accept", { token });

        const redirectUrl = normalizeRedirectUrl(
          res.data?.redirectUrl || res.data?.RedirectUrl
        );

        const returnedToken = res.data?.token || res.data?.Token || res.data?.impersonationToken;

        if (returnedToken) {
          const payload = decodeJwtPayload(returnedToken) || {};
          localStorage.setItem("token", returnedToken);
          localStorage.setItem("userId", payload.userId ?? payload.UserId ?? "");
          localStorage.setItem("companyId", payload.companyId ?? payload.CompanyId ?? "");
          localStorage.setItem("access", payload.access ?? payload.Access ?? "");
          localStorage.setItem("BusinessUnit", payload.businessUnit ?? payload.BusinessUnit ?? "");
          localStorage.setItem("isImpersonation", "1");

          window.location.replace(
            redirectUrl || routeBasedOnAccess(payload.access ?? payload.Access ?? "")
          );
          setStatus("done");
          return;
        }

        if (redirectUrl) {
          window.location.replace(redirectUrl);
          setStatus("done");
          return;
        }

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

  return (
    <div style={{ padding: 24 }} className="min-h-screen flex items-start justify-center pt-24">
      {status === "working" && (
        <div className="text-center">
          <div className="mb-2">Signing you in as tenant... please wait.</div>
          <div className="text-sm text-slate-500">
            If you're not redirected automatically, check browser console/network for errors.
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="max-w-xl bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Impersonation failed</h3>
          <p className="text-sm text-red-600 mb-4">{message}</p>
          <div className="flex gap-2">
            <button onClick={() => setRetryCount(c => c + 1)} className="px-3 py-2 rounded border">
              Retry
            </button>
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