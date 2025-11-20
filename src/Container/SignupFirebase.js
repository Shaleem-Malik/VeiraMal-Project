// SignupFirebase.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Button, LinearProgress, Grid, Card, CardContent,
  CardActions, Typography, Box, Paper, IconButton, Chip, TextField, Collapse,
  Fade, Grow
} from '@material-ui/core';
import { ArrowBack, CheckCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import { SessionSlider } from 'Components/Widgets';
import { Helmet } from "react-helmet";

import AppConfig from 'Constants/AppConfig';
import {
  signupUserInFirebase
} from 'Store/Actions';

// localStorage keys
const LS_KEY_PLAN = 'veiramal_selected_plan';
const LS_KEY_SEATS = 'veiramal_additional_seats';

const useStyles = makeStyles((theme) => ({
  // root: prevent any horizontal overflow at page level
  root: { 
    minHeight: '100vh', 
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #f6f9ff 0%, #ffffff 60%)', 
    paddingBottom: theme.spacing(6),
    overflowX: 'hidden'       // <--- prevents horizontal scroll
  },
  header: { 
    background: 'transparent', 
    boxShadow: 'none', 
    paddingTop: theme.spacing(2), 
    paddingBottom: theme.spacing(2) 
  },
  logo: { 
    display: 'flex', 
    alignItems: 'center',
    // ensure logo cannot overflow its container
    '& img': { maxWidth: '100%', height: 'auto', display: 'block' }
  },

  // mainContainer becomes the scrollable area (vertical only)
  mainContainer: { 
    marginTop: theme.spacing(6),
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',     // <--- ensure no horizontal scroll here either
    maxHeight: 'calc(100vh - 140px)',
    paddingBottom: theme.spacing(4),
    width: '100%',           // keep it within viewport width
    boxSizing: 'border-box'  // safer sizing behavior
  },

  hero: { padding: theme.spacing(4), marginBottom: theme.spacing(3), borderRadius: 16, background: 'linear-gradient(135deg,#ffffff,#f8fbff)', boxShadow: '0 6px 30px rgba(20,40,80,0.08)' },
  plansGrid: { marginTop: theme.spacing(2) },
  planCard: { borderRadius: 12, height: '100%', transition: 'transform 300ms, box-shadow 300ms', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 30px rgba(15,30,80,0.12)' } },
  planSelected: { border: `2px solid ${theme.palette.primary.main}`, boxShadow: '0 12px 40px rgba(15,30,80,0.14)', transform: 'translateY(-6px)' },
  formPaper: { padding: theme.spacing(4), borderRadius: 12, boxShadow: '0 10px 30px rgba(20,40,80,0.08)' },
  summaryPaper: { padding: theme.spacing(3), borderRadius: 12, background: '#fff', boxShadow: '0 8px 24px rgba(15,30,80,0.06)' },
  chooseBtn: { width: '100%' },
  smallMuted: { color: '#6b7280' },
  ctaRow: { marginTop: theme.spacing(3) },
  socialRow: { marginTop: theme.spacing(2) },
  backBtn: { marginBottom: theme.spacing(2) }
}));



export default function SignupFirebase(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading); // optional app-level loading

  // superuser + company fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyContactNumber, setCompanyContactNumber] = useState('');
  const [superUserContactNumber, setSuperUserContactNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyABN, setCompanyABN] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [superUserLocation, setSuperUserLocation] = useState('');

  // plans & selection
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [additionalSeatsRequested, setAdditionalSeatsRequested] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadPlans() {
      setPlansLoading(true);
      try {
        const res = await api.get('Subscription/plans');
        if (!mounted) return;
        const data = res.data || [];
        setPlans(data);

        const savedPlanJson = localStorage.getItem(LS_KEY_PLAN);
        const savedSeats = localStorage.getItem(LS_KEY_SEATS);
        if (savedPlanJson) {
          try {
            const parsed = JSON.parse(savedPlanJson);
            const savedId = parsed.subscriptionPlanId ?? parsed.SubscriptionPlanId ?? parsed.id ?? parsed.ID;
            const found = data.find(p => {
              const pid = p.subscriptionPlanId ?? p.SubscriptionPlanId ?? p.id ?? p.ID;
              return String(pid) === String(savedId);
            });
            if (found) {
              setSelectedPlan(found);
              setShowForm(true);
            } else {
              setSelectedPlan(parsed);
              setShowForm(true);
            }
          } catch (err) {
            console.warn('Invalid saved plan', err);
          }
        }
        if (savedSeats !== null) {
          const n = parseInt(savedSeats, 10);
          if (!Number.isNaN(n) && n >= 0) setAdditionalSeatsRequested(n);
        }
      } catch (err) {
        console.error('Plans load failed', err);
        NotificationManager.error('Failed to load subscription plans.');
      } finally {
        if (mounted) setPlansLoading(false);
      }
    }
    loadPlans();
    return () => { mounted = false; };
  }, []);

  const persistSelectedPlan = (plan) => { try { localStorage.setItem(LS_KEY_PLAN, JSON.stringify(plan)); } catch (e) {} };
  const persistAdditionalSeats = (n) => { try { localStorage.setItem(LS_KEY_SEATS, String(n)); } catch (e) {} };
  const clearSavedPlan = () => { try { localStorage.removeItem(LS_KEY_PLAN); localStorage.removeItem(LS_KEY_SEATS); setSelectedPlan(null); setAdditionalSeatsRequested(0); setShowForm(false); } catch (e) {} };

  const extractPlanId = (plan) => {
    if (!plan) return null;
    if (typeof plan === 'string') return plan;
    return plan.subscriptionPlanId ?? plan.SubscriptionPlanId ?? plan.id ?? plan.ID ?? null;
  };

  const computeMonthlyTotal = () => {
    if (!selectedPlan) return 0;
    const base = Number(selectedPlan.pricePerMonth ?? selectedPlan.PricePerMonth ?? 0);
    const perSeat = Number(selectedPlan.additionalSeatPrice ?? selectedPlan.AdditionalSeatPrice ?? 0);
    return base + (Number(additionalSeatsRequested || 0) * perSeat);
  };

  const onSelectPlan = (plan) => {
    setSelectedPlan(plan);
    persistSelectedPlan(plan);
    setAdditionalSeatsRequested(0);
    persistAdditionalSeats(0);
    setTimeout(() => setShowForm(true), 150);
  };

  const onBackToPlans = () => {
    setShowForm(false);
  };

  const onUserSignUp = async () => {
    if (!selectedPlan) {
      NotificationManager.error('Please select a plan.');
      return;
    }
    if (!email.trim() || !firstName.trim() || !companyName.trim()) {
      NotificationManager.error('Please fill required fields: Email, First name and Company name.');
      return;
    }

    const additionalSeats = Math.max(0, parseInt(additionalSeatsRequested || '0', 10) || 0);
    const planId = extractPlanId(selectedPlan);

    // validate plan exists in fetched list
    const planExists = plans.some(p => String(extractPlanId(p)) === String(planId));
    if (!planId || !planExists) {
      NotificationManager.error('Selected plan is invalid. Please re-select a plan from the available options.');
      setShowForm(false);
      return;
    }

    // fallbacks
    const suContact = superUserContactNumber?.trim() ? superUserContactNumber.trim() : (companyContactNumber?.trim() ? companyContactNumber.trim() : null);
    const suLocation = superUserLocation?.trim() ? superUserLocation.trim() : (companyLocation?.trim() ? companyLocation.trim() : null);

    // Build payload matching CompanyOnboardDto (PascalCase)
    const payload = {
      SuperUserEmail: String(email).trim(),
      SuperUserFirstName: String(firstName).trim(),
      SuperUserMiddleName: middleName?.trim() || null,
      SuperUserLastName: lastName?.trim() || null,
      SuperUserContactNumber: suContact,
      SuperUserLocation: suLocation,
      CompanyName: String(companyName).trim(),
      CompanyABN: companyABN?.trim() || null,
      ContactNumber: companyContactNumber?.trim() || null,
      CompanyLocation: companyLocation?.trim() || null,
      SubscriptionPlanId: String(planId),
      AdditionalSeatsRequested: additionalSeats
    };

    setSubmitting(true);
    try {
      // Build success/cancel/signin URLs to pass to server (server includes sign-in URL in the onboarding email)
      const successUrl = window.location.origin + '/checkout-success';
      const cancelUrl = window.location.origin + '/checkout-cancel';
      const signInUrl = window.location.origin + '/signin';

      // dispatch action which will call backend and redirect to Stripe Checkout
      await dispatch(signupUserInFirebase(payload, props.history, { successUrl, cancelUrl, signInUrl }));

      // note: signupUserInFirebase handles redirectToCheckout (so this code generally won't continue if redirect occurs)
    } catch (err) {
      console.error('Onboard error:', err);
      // A helpful notification will have already been shown by the action in most failure cases
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QueueAnim type="bottom" duration={900}>
      <Helmet>
          <title>Signup</title>
      </Helmet>
      <div className={classes.root} key="signup-root">
        {(loading || plansLoading) && <LinearProgress />}

        <AppBar position="static" className={classes.header}>
          <Toolbar>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className={classes.logo}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src={AppConfig.appLogo} alt="logo" width="130" />
                </Link>
              </div>
              <div>
                <Link to="/signin" style={{ color: '#374151', marginRight: 16, textDecoration: 'none' }}>Already have an account?</Link>
                <Button component={Link} to="/signin" variant="contained" color="primary">Sign In</Button>
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <Box maxWidth="1200px" mx="auto" className={classes.mainContainer}>
          <Paper className={classes.hero}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Get started with <span style={{ color: '#1976d2' }}>{AppConfig.brandName}</span>
                </Typography>
                <Typography className={classes.smallMuted}>Powerful HR analytics for companies — select a plan to create your company account.</Typography>
              </Grid>

              <Grid item xs={12} md={4} style={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" className={classes.smallMuted}>Need help?</Typography>
                <Typography variant="h6">Contact: <strong>{AppConfig.barndemail?.toLowerCase() || 'company'}</strong></Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* PLAN GRID */}
          <Collapse in={!showForm} timeout={500}>
            <Box className={classes.plansGrid} mt={2}>
              <Grid container spacing={3}>
                {plans && plans.length > 0 ? plans.map((p) => {
                  const pid = extractPlanId(p);
                  const isSelected = selectedPlan && (String(extractPlanId(selectedPlan)) === String(pid));
                  return (
                    <Grid item xs={12} sm={6} md={4} key={pid ?? Math.random()}>
                      <Grow in={!showForm} timeout={300}>
                        <Card className={`${classes.planCard} ${isSelected ? classes.planSelected : ''}`}>
                          <CardContent style={{ display: 'flex', flexDirection: 'column', height: 240 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="h6">{p.package ?? p.Package}</Typography>
                              {isSelected && <Chip icon={<CheckCircle />} label="Selected" color="primary" />}
                            </Box>
                            <Typography variant="h5" style={{ marginTop: 4 }}>
                              {p.pricePerMonth !== null && p.pricePerMonth !== undefined ? `AUD ${Number(p.pricePerMonth).toLocaleString()} / month` : 'Custom / Contact Sales'}
                            </Typography>
                            <Typography variant="body2" className={classes.smallMuted} style={{ marginTop: 8 }}>{p.idealFor ?? p.IdealFor}</Typography>

                            <Box mt="auto" className={classes.smallMuted}>
                              <Typography variant="body2"><strong>Seats:</strong> {p.baseUserSeats === 0 ? 'Unlimited' : p.baseUserSeats}</Typography>
                              <Typography variant="body2"><strong>Superusers:</strong> {p.superUsers ?? p.SuperUsers}</Typography>
                              <Typography variant="body2"><strong>Reports:</strong> {p.reportingLevel ?? p.ReportingLevel}</Typography>
                            </Box>
                          </CardContent>
                          <CardActions style={{ padding: 16 }}>
                            <Button variant={isSelected ? "contained" : "outlined"} color="primary" className={classes.chooseBtn} onClick={() => onSelectPlan(p)}>
                              {isSelected ? 'Continue' : 'Choose Plan'}
                            </Button>
                          </CardActions>
                        </Card>
                      </Grow>
                    </Grid>
                  );
                }) : (
                  <Grid item xs={12}>
                    <Paper className={classes.formPaper}><Typography>No subscription plans available right now. Please try again later or contact sales.</Typography></Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>

          {/* FORM + summary */}
          <Collapse in={showForm} timeout={600}>
            <Box mt={4}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <Fade in={showForm} timeout={400}>
                    <Paper className={classes.formPaper}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <IconButton onClick={onBackToPlans} className={classes.backBtn} size="small"><ArrowBack /></IconButton>
                          <Box ml={1}>
                            <Typography variant="h6">Create company account</Typography>
                            <Typography variant="body2" className={classes.smallMuted}>You chose: <strong>{selectedPlan?.package ?? selectedPlan?.Package}</strong></Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField label="Company Contact Number" variant="outlined" fullWidth value={companyContactNumber} onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              if (val.length <= 15) setCompanyContactNumber(val);
                            }} helperText="Optional. For fallback to superuser contact." />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField label="First Name" variant="outlined" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField label="Middle Name (optional)" variant="outlined" fullWidth value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField label="Last Name" variant="outlined" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField label="Superuser Contact Number (optional)" variant="outlined" fullWidth value={superUserContactNumber} onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              if (val.length <= 15) setSuperUserContactNumber(val);
                            }} helperText="If empty, company contact number will be used." />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField label="Superuser Location (optional)" variant="outlined" fullWidth value={superUserLocation} onChange={(e) => setSuperUserLocation(e.target.value)} helperText="If empty, company location will be used." />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField label="Company Name" variant="outlined" fullWidth value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField label="Company ABN" variant="outlined" fullWidth value={companyABN} onChange={(e) => {
                              const val = e.target.value;
                              if (val.length <= 11) setCompanyABN(val);
                            }} inputProps={{ maxLength: 11 }} helperText="Must be exactly 11 characters if provided" />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField label="Company Location (address)" variant="outlined" fullWidth value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} helperText="Optional address / location of company" />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            {(selectedPlan?.additionalSeatsAllowed || selectedPlan?.AdditionalSeatsAllowed) ? (
                              <TextField label="Additional user seats (optional)" variant="outlined" fullWidth type="number" inputProps={{ min: 0 }} value={additionalSeatsRequested} onChange={(e) => {
                                const v = Math.max(0, parseInt(e.target.value || '0', 10) || 0);
                                setAdditionalSeatsRequested(v);
                                persistAdditionalSeats(v);
                              }} helperText={`Base seats: ${selectedPlan?.baseUserSeats ?? selectedPlan?.BaseUserSeats} — Extra @ AUD ${(selectedPlan?.additionalSeatPrice ?? selectedPlan?.AdditionalSeatPrice) || 0}/seat/month`} />
                            ) : (
                              <Box px={1} py={1} borderRadius={6} bgcolor="#f8fafc"><Typography variant="body2" className={classes.smallMuted}>Additional seats for this plan must be purchased via sales / account manager.</Typography></Box>
                            )}
                          </Grid>

                          <Grid item xs={12} className={classes.ctaRow}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" gap={8}>
                              <Button variant="contained" color="primary" size="large" onClick={onUserSignUp} disabled={!selectedPlan || loading || submitting}>
                                {submitting ? 'Creating...' : (selectedPlan?.pricePerMonth ? `Create Company — AUD ${computeMonthlyTotal().toLocaleString()}/mo` : 'Create Company — Contact Sales')}
                              </Button>

                              <Button variant="outlined" onClick={clearSavedPlan} disabled={submitting}>Clear saved plan</Button>
                            </Box>
                          </Grid>

                          {/* <Grid item xs={12} className={classes.socialRow}>
                            <Typography variant="body2" className={classes.smallMuted}>or continue with</Typography>
                            <Box mt={1} display="flex" gap={8}>
                              <Fab size="small" onClick={() => dispatch(signinUserWithFacebook(props.history))} className="btn-facebook"><i className="zmdi zmdi-facebook" /></Fab>
                              <Fab size="small" onClick={() => dispatch(signinUserWithGoogle(props.history))} className="btn-google"><i className="zmdi zmdi-google" /></Fab>
                              <Fab size="small" onClick={() => dispatch(signinUserWithTwitter(props.history))} className="btn-twitter"><i className="zmdi zmdi-twitter" /></Fab>
                              <Fab size="small" onClick={() => dispatch(signinUserWithGithub(props.history))} className="btn-instagram"><i className="zmdi zmdi-github-alt" /></Fab>
                            </Box>
                          </Grid> */}

                          <Grid item xs={12}><Typography variant="caption" className={classes.smallMuted}>By signing up you agree to {AppConfig.brandName} — <Link to="/terms-condition">Terms of Service</Link></Typography></Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Fade>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Fade in={showForm} timeout={450}>
                    <Paper className={classes.summaryPaper}>
                      <Typography variant="subtitle1">Plan summary</Typography>
                      <Box mt={1}>
                        <Typography variant="h6">{selectedPlan?.package ?? selectedPlan?.Package}</Typography>
                        <Typography variant="h5" style={{ marginTop: 6 }}>{selectedPlan?.pricePerMonth !== null && selectedPlan?.pricePerMonth !== undefined ? `AUD ${Number(selectedPlan?.pricePerMonth).toLocaleString()}/month` : 'Custom pricing / Contact Sales'}</Typography>

                        <Box mt={2}>
                          <Typography variant="body2"><strong>Base seats:</strong> {selectedPlan?.baseUserSeats === 0 ? 'Unlimited' : selectedPlan?.baseUserSeats}</Typography>
                          <Typography variant="body2"><strong>Superusers:</strong> {selectedPlan?.superUsers ?? selectedPlan?.SuperUsers}</Typography>
                          <Typography variant="body2"><strong>Reports:</strong> {selectedPlan?.reportingLevel ?? selectedPlan?.ReportingLevel}</Typography>
                          <Typography variant="body2" style={{ marginTop: 8 }}>{selectedPlan?.keyFeatures ?? selectedPlan?.KeyFeatures}</Typography>
                        </Box>

                        <Box mt={3} p={2} borderRadius={8} bgcolor="#f8fafc">
                          <Typography variant="body2" className={classes.smallMuted}>Additional seats</Typography>
                          <Typography variant="h6">{Number(additionalSeatsRequested || 0)} seats</Typography>
                          <Typography variant="body2" className={classes.smallMuted}>Price per extra seat: AUD {(selectedPlan?.additionalSeatPrice ?? selectedPlan?.AdditionalSeatPrice) || 0}/month</Typography>
                        </Box>

                        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">Monthly total</Typography>
                          <Typography variant="h6" style={{ color: '#1976d2' }}>{selectedPlan?.pricePerMonth ? `AUD ${computeMonthlyTotal().toLocaleString()}/mo` : 'Contact Sales'}</Typography>
                        </Box>

                        <Box mt={3}><Button variant="text" color="primary" onClick={onBackToPlans}>Change plan</Button></Box>
                      </Box>
                    </Paper>
                  </Fade>
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          <Box mt={4} style={{ textAlign: 'right' }}><SessionSlider /></Box>
        </Box>
      </div>
    </QueueAnim>
  );
}
