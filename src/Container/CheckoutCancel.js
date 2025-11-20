// src/pages/CheckoutCancel.jsx
import React from "react";
import { Box, Paper, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: theme.spacing(3) },
  paper: { maxWidth: 880, width: "100%", padding: theme.spacing(4), borderRadius: 12 },
  actions: { marginTop: theme.spacing(3), display: "flex", gap: theme.spacing(2), flexWrap: "wrap" },
  muted: { color: "#6b7280" },
  sessionBox: { marginTop: theme.spacing(2), padding: theme.spacing(2), background: "#f8fafc", borderRadius: 8, fontFamily: "monospace" }
}));

// keys used by your signup page
// const LS_KEY_PLAN = "veiramal_selected_plan";
// const LS_KEY_SEATS = "veiramal_additional_seats";

export default function CheckoutCancel() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // read optional session_id from querystring (Stripe redirects with ?session_id=...)
  const qs = new URLSearchParams(location.search);
  const sessionId = qs.get("session_id");

  const goHome = () => history.push("/");
  const goSignup = () => history.push("/signup"); // adjust if your signup route differs
  // const clearSavedPlan = () => {
  //   try {
  //     localStorage.removeItem(LS_KEY_PLAN);
  //     localStorage.removeItem(LS_KEY_SEATS);
  //     // small feedback
  //     // if you use NotificationManager in your app you can call it here
  //     // NotificationManager.success('Saved plan cleared');
  //     // fallback: quick visual hint
  //     alert("Saved plan cleared.");
  //   } catch (e) {
  //     alert("Failed to clear saved plan.");
  //   }
  // };

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Payment cancelled
        </Typography>

        <Typography variant="body1" className={classes.muted}>
          You returned from the payment page without completing payment. If you were trying to create a company account, the creation step ran before checkout — payment wasn't completed so the subscription wasn't activated.
        </Typography>

        <Typography variant="body2" style={{ marginTop: 12 }}>
          What you can do next:
        </Typography>
        {/* <ul style={{ marginTop: 8, color: "#374151" }}>
          <li>Retry payment from the signup flow (click “Resume signup”).</li>
          <li>Return to plan selection to pick another plan or modify seats.</li>
          <li>Contact support if you need help (support@veiramal.com).</li>
        </ul> */}

        {sessionId && (
          <div className={classes.sessionBox}>
            <strong>Stripe session:</strong> <span style={{ wordBreak: "break-all" }}>{sessionId}</span>
          </div>
        )}

        <div className={classes.actions}>
          <Button variant="contained" color="primary" onClick={goHome}>
            Signin
          </Button>

          <Button variant="outlined" color="primary" onClick={goSignup}>
            signup
          </Button>
        </div>
      </Paper>
    </Box>
  );
}
