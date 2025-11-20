import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Box, Typography, Paper } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { NotificationManager } from "react-notifications";

export default function CheckoutSuccess() {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [autoResent, setAutoResent] = useState(false);

  const qs = new URLSearchParams(location.search);
  const sessionId = qs.get("session_id");

  // Fetch Stripe session details
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!sessionId) {
        setError("No session_id found in URL.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5228/api/stripe/session?sessionId=${encodeURIComponent(sessionId)}`);
        if (!mounted) return;
        setSession(res.data);
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError(err?.response?.data?.message || "Failed to fetch session information.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [sessionId]);

  // Automatically call resend-onboarding if payment succeeded
  useEffect(() => {
    if (!session || autoResent) return;

    const paid = session.paymentStatus === "paid" || session.payment_status === "paid";
    if (paid) {
      handleResendOnboarding(true); // auto mode
    }
  }, [session]);

  const handleGoToSignin = () => history.push("/signin");

  const handleResendOnboarding = async (auto = false) => {
    if (!session || !session.metadata) {
      if (!auto) NotificationManager.error("Missing session metadata required to resend email.");
      return;
    }

    const { companyId, userId, companySubscriptionId } = session.metadata;
    if (!companyId || !userId || !companySubscriptionId) {
      if (!auto) NotificationManager.error("Required metadata missing (companyId/userId/companySubscriptionId).");
      return;
    }

    setResendLoading(true);
    try {
      await axios.post("http://localhost:5228/api/company/resend-onboarding", {
        companyId,
        userId,
        companySubscriptionId
      });

      if (!auto) {
        NotificationManager.success("If a pending onboarding email existed, it has been resent.");
      } else {
        setAutoResent(true);
        console.log("✅ Auto resend-onboarding triggered successfully.");
      }
    } catch (err) {
      console.error("Resend failed:", err);
      if (!auto) NotificationManager.error(err?.response?.data?.message || "Failed to resend onboarding email.");
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh" p={2}>
        <Paper style={{ padding: 24, maxWidth: 720 }}>
          <Typography variant="h5">Checkout</Typography>
          <Typography color="error" style={{ marginTop: 12 }}>{error}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => history.push("/")}>Return home</Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  const paid = session.paymentStatus === "paid" || session.payment_status === "paid";

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh" p={2}>
      <Paper style={{ padding: 28, maxWidth: 820 }}>
        <Typography variant="h4" gutterBottom>
          {paid ? "Payment successful" : "Payment received (pending confirmation)"}
        </Typography>

        <Typography variant="body1" style={{ marginTop: 12 }}>
          {paid
            ? "Thanks — your payment was successful. You will receive an email with a temporary password shortly to sign in to your new account."
            : "We have received the checkout session, but payment is not yet marked as paid. If you don't receive your email within a few minutes, you can try the button below to resend onboarding email."}
        </Typography>

        <Box mt={2}>
          <Typography variant="body2"><strong>Amount:</strong> {session.amountTotal ? `${(session.amountTotal / 100).toFixed(2)} ${session.currency?.toUpperCase()}` : "N/A"}</Typography>
          <Typography variant="body2"><strong>Customer email (Stripe):</strong> {session.customerEmail ?? "N/A"}</Typography>
        </Box>

        <Box mt={4} display="flex" gap={12} alignItems="center">
          <Button variant="contained" color="primary" onClick={handleGoToSignin}>Go to Sign in</Button>

          <Button variant="outlined" disabled={resendLoading} onClick={() => handleResendOnboarding(false)}>
            {resendLoading ? "Resending…" : "Resend onboarding email"}
          </Button>

          <Button variant="text" onClick={() => window.open("mailto:support@veiramal.com")}>Contact Support</Button>
        </Box>

        <Box mt={2}>
          <Typography variant="caption" color="textSecondary">
            Note: The server sends your onboarding email when Stripe confirms payment via webhook.
            If that failed, we automatically retried once after confirming your payment.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
