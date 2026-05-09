// SignupFirebase.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar, Toolbar, Button, LinearProgress, Grid, Card, CardContent,
    CardActions, Typography, Box, Paper, IconButton, Chip, TextField, Collapse,
    Fade, Grow, FormHelperText, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';
import { ArrowBack, CheckCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
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

// Validation functions (unchanged)...
const validateABN = (abn) => {
    if (!abn) return { isValid: true, message: '' };
    const cleaned = abn.replace(/\s/g, '');
    if (cleaned.length !== 11) return { isValid: false, message: 'ABN must be exactly 11 digits' };
    if (!/^\d+$/.test(cleaned)) return { isValid: false, message: 'ABN must contain only numbers' };
    return { isValid: true, message: '' };
};

const validatePhone = (phone, fieldName) => {
    if (!phone) return { isValid: true, message: '' };
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length !== 10) return { isValid: false, message: `${fieldName} must be exactly 10 digits` };
    if (!/^\d+$/.test(cleaned)) return { isValid: false, message: `${fieldName} must contain only numbers` };
    if (!/^0[23478]\d{8}$/.test(cleaned)) return { isValid: false, message: `${fieldName} must be a valid Australian number` };
    return { isValid: true, message: '' };
};
const formatAusPhone = (value) => {
    if (!value) return '';
    const digits = String(value).replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
};
const validateEmail = (email) => {
    if (!email) return { isValid: false, message: 'Email is required' };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true, message: '' };
};
const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') return { isValid: false, message: `${fieldName} is required` };
    return { isValid: true, message: '' };
};

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #f6f9ff 0%, #ffffff 60%)',
        paddingBottom: theme.spacing(6),
        overflowX: 'hidden'
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
        '& img': { maxWidth: '100%', height: 'auto', display: 'block' }
    },
    mainContainer: {
        marginTop: theme.spacing(6),
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 'calc(100vh - 140px)',
        paddingBottom: theme.spacing(4),
        width: '100%',
        boxSizing: 'border-box'
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
    backBtn: { marginBottom: theme.spacing(2) },
    errorText: {
        color: theme.palette.error.main,
        fontSize: '0.75rem',
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(1)
    },
    fieldError: {
        '& .MuiOutlinedInput-root': {
            '&.Mui-error fieldset': {
                borderColor: theme.palette.error.main,
            }
        }
    },
    dialogPaper: {
        borderRadius: 12,
        padding: theme.spacing(2)
    }
}));

export default function SignupFirebase(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading);
    const location = useLocation();
    const history = useHistory();

    // Track if we've already shown the dialog in this session
    const hasShownDialog = useRef(false);
    const dialogDecisionMade = useRef(false);

    // Form fields
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
    const [abnValidated, setAbnValidated] = useState(false);
    const [abnChecking, setAbnChecking] = useState(false);
    const [abnServerError, setAbnServerError] = useState('');

    // Validation errors
    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        companyName: '',
        companyABN: '',
        companyContactNumber: '',
        superUserContactNumber: ''
    });

    // Plans & selection
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [additionalSeatsRequested, setAdditionalSeatsRequested] = useState(0);

    // Billing mode: 'subscription' (monthly) or 'one_time'
    const [billingMode, setBillingMode] = useState('subscription');

    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    // Dialog state
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);

    // Google Maps API key from environment
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

     // Refs for the location inputs
    const companyLocationInputRef = useRef(null);
    const superUserLocationInputRef = useRef(null);

     const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

         // ---------- Load Google Maps script ----------
    useEffect(() => {
        if (!googleMapsApiKey) {
            console.warn('Google Maps API key missing – Places Autocomplete disabled.');
            return;
        }
        // If already loaded (e.g. another component loaded it), mark ready
        if (window.google && window.google.maps && window.google.maps.places) {
            setGoogleScriptLoaded(true);
            return;
        }

        const scriptId = 'google-maps-script';
        // Another component may have started loading it
        if (document.getElementById(scriptId)) {
            const checkExist = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.places) {
                    setGoogleScriptLoaded(true);
                    clearInterval(checkExist);
                }
            }, 300);
            return () => clearInterval(checkExist);
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleScriptLoaded(true);
        script.onerror = () => console.error('Failed to load Google Maps API script.');
        document.head.appendChild(script);
    }, []);

    // ---------- Attach Autocomplete when inputs appear ----------
    useEffect(() => {
        if (!googleScriptLoaded || !showForm) return;

        let autocompleteCompany = null;
        let autocompleteSuperUser = null;

        if (companyLocationInputRef.current) {
            autocompleteCompany = new window.google.maps.places.Autocomplete(
                companyLocationInputRef.current,
                { types: ['address'] }
            );
            autocompleteCompany.addListener('place_changed', () => {
                const place = autocompleteCompany.getPlace();
                if (place.formatted_address) {
                    setCompanyLocation(place.formatted_address);
                }
            });
        }

        if (superUserLocationInputRef.current) {
            autocompleteSuperUser = new window.google.maps.places.Autocomplete(
                superUserLocationInputRef.current,
                { types: ['address'] }
            );
            autocompleteSuperUser.addListener('place_changed', () => {
                const place = autocompleteSuperUser.getPlace();
                if (place.formatted_address) {
                    setSuperUserLocation(place.formatted_address);
                }
            });
        }

        return () => {
            if (autocompleteCompany) {
                window.google.maps.event.clearInstanceListeners(autocompleteCompany);
            }
            if (autocompleteSuperUser) {
                window.google.maps.event.clearInstanceListeners(autocompleteSuperUser);
            }
        };
    }, [googleScriptLoaded, showForm]);

    // ---------- Fix z-index of Google dropdown ----------
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `.pac-container { z-index: 2000 !important; }`;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        const savedPlan = localStorage.getItem(LS_KEY_PLAN);
        const savedSeats = localStorage.getItem(LS_KEY_SEATS);

        const referrer = document.referrer;
        const fromSignIn = referrer && (
            referrer.includes('/signin') ||
            referrer.includes('/login') ||
            referrer.includes('signin') ||
            referrer.includes('login')
        );

        const urlParams = new URLSearchParams(window.location.search);
        const fromSignInParam = urlParams.get('fromSignIn');
        const sessionFromSignIn = sessionStorage.getItem('cameFromSignIn');

        if ((fromSignIn || fromSignInParam || sessionFromSignIn) &&
            (savedPlan || savedSeats) &&
            !hasShownDialog.current) {

            setOpenConfirmDialog(true);
            hasShownDialog.current = true;
            sessionStorage.removeItem('cameFromSignIn');
        } else {
            loadPlans(false);
        }

        return () => {
            sessionStorage.removeItem('cameFromSignIn');
        };
    }, []);

    const handleBlur = (fieldName) => (e) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName, e.target.value);
    };

    const normalizeABN = (abn) => String(abn || '').replace(/\D/g, '').slice(0, 11);

    const validateABN = (abn) => {
        const cleaned = normalizeABN(abn);
        if (!cleaned) return { isValid: false, message: 'Company ABN is required' };
        if (cleaned.length !== 11) return { isValid: false, message: 'ABN must be exactly 11 digits' };
        if (!/^\d+$/.test(cleaned)) return { isValid: false, message: 'ABN must contain only numbers' };
        return { isValid: true, message: '' };
    };

    const checkAbnWithServer = async (value = companyABN) => {
        const cleaned = normalizeABN(value);

        if (!cleaned) {
            setAbnValidated(false);
            setAbnServerError('Company ABN is required');
            setErrors(prev => ({ ...prev, companyABN: 'Company ABN is required' }));
            return false;
        }

        setAbnChecking(true);
        setAbnServerError('');

        try {
            const res = await api.post('Abn/validate', { abn: cleaned });

            if (!res?.data?.isValid) {
                const msg = res?.data?.message || res?.data?.abnError || 'ABN is not valid';
                setAbnValidated(false);
                setAbnServerError(msg);
                setErrors(prev => ({ ...prev, companyABN: msg }));
                return false;
            }

            setAbnValidated(true);
            setAbnServerError('');
            setErrors(prev => ({ ...prev, companyABN: '' }));
            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.abnError ||
                err?.response?.data?.message ||
                'ABN validation failed';

            setAbnValidated(false);
            setAbnServerError(msg);
            setErrors(prev => ({ ...prev, companyABN: msg }));
            return false;
        } finally {
            setAbnChecking(false);
        }
    };

    const validateField = (fieldName, value) => {
        let validation = { isValid: true, message: '' };

        switch (fieldName) {
            case 'email':
                validation = validateEmail(value);
                break;
            case 'firstName':
                validation = validateRequired(value, 'First name');
                break;
            case 'companyName':
                validation = validateRequired(value, 'Company name');
                break;
            case 'companyABN':
                validation = validateABN(value);
                break;
            case 'companyContactNumber':
                validation = validatePhone(value, 'Company contact number');
                break;
            case 'superUserContactNumber':
                validation = validatePhone(value, 'Superuser contact number');
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: validation.message }));
        return validation.isValid;
    };

    const validateForm = () => {
        const newErrors = {
            email: validateEmail(email).message,
            firstName: validateRequired(firstName, 'First name').message,
            companyName: validateRequired(companyName, 'Company name').message,
            companyABN: validateABN(companyABN).message,
            companyContactNumber: validatePhone(companyContactNumber, 'Company contact number').message,
            superUserContactNumber: validatePhone(superUserContactNumber, 'Superuser contact number').message
        };

        setErrors(newErrors);

        setTouched({
            email: true,
            firstName: true,
            companyName: true,
            companyABN: true,
            companyContactNumber: true,
            superUserContactNumber: true
        });

        return !Object.values(newErrors).some(error => error !== '');
    };

    const loadPlans = async (loadSavedPlan = true) => {
        setPlansLoading(true);
        try {
            const res = await api.get('Subscription/plans');
            const data = res.data || [];
            setPlans(data);

            if (loadSavedPlan) {
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
            }
        } catch (err) {
            console.error('Plans load failed', err);
            NotificationManager.error('Failed to load subscription plans.');
        } finally {
            setPlansLoading(false);
        }
    };

    const handleDialogYes = () => {
        dialogDecisionMade.current = true;
        setDialogLoading(true);
        clearSavedPlan();
        setOpenConfirmDialog(false);
        loadPlans(false);
        setDialogLoading(false);
    };

    const handleDialogNo = () => {
        dialogDecisionMade.current = true;
        setOpenConfirmDialog(false);
        loadPlans(true);
    };

    const handleDialogClose = () => {
        if (!dialogDecisionMade.current) {
            handleDialogNo();
        }
    };

    const persistSelectedPlan = (plan) => {
        try {
            localStorage.setItem(LS_KEY_PLAN, JSON.stringify(plan));
        } catch (e) {
            console.error('Failed to save plan:', e);
        }
    };

    const persistAdditionalSeats = (n) => {
        try {
            localStorage.setItem(LS_KEY_SEATS, String(n));
        } catch (e) {
            console.error('Failed to save seats:', e);
        }
    };

    const clearSavedPlan = () => {
        try {
            localStorage.removeItem(LS_KEY_PLAN);
            localStorage.removeItem(LS_KEY_SEATS);
            setSelectedPlan(null);
            setAdditionalSeatsRequested(0);
            setShowForm(false);
        } catch (e) {
            console.error('Failed to clear saved plan:', e);
        }
    };

    const extractPlanId = (plan) => {
        if (!plan) return null;
        if (typeof plan === 'string') return plan;
        return plan.subscriptionPlanId ?? plan.SubscriptionPlanId ?? plan.id ?? plan.ID ?? null;
    };

    // helper to extract Stripe recurring price id from the plan object (if present)
    const extractPriceId = (plan) => {
        if (!plan) return null;
        return plan.priceId ?? plan.PriceId ?? plan.stripePriceId ?? plan.StripePriceId ?? plan.stripe_price_id ?? plan.stripe_priceId ?? null;
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

        if (!validateForm()) {
            NotificationManager.error('Please fix the validation errors before submitting.');
            return;
        }

        const abnOk = await checkAbnWithServer(companyABN);
        if (!abnOk) {
            NotificationManager.error('Please enter a valid ABN before continuing.');
            return;
        }


        const additionalSeats = Math.max(0, parseInt(additionalSeatsRequested || '0', 10) || 0);
        const planId = extractPlanId(selectedPlan);

        const planExists = plans.some(p => String(extractPlanId(p)) === String(planId));
        if (!planId || !planExists) {
            NotificationManager.error('Selected plan is invalid. Please re-select a plan from the available options.');
            setShowForm(false);
            return;
        }

        const suContact = superUserContactNumber?.trim() ? superUserContactNumber.trim() : (companyContactNumber?.trim() ? companyContactNumber.trim() : null);
        const suLocation = superUserLocation?.trim() ? superUserLocation.trim() : (companyLocation?.trim() ? companyLocation.trim() : null);

        const suRaw = superUserContactNumber?.trim() ? superUserContactNumber.trim() : (companyContactNumber?.trim() ? companyContactNumber.trim() : null);

        // Clean digits only for backend
        const cleanedSuContact = suRaw ? suRaw.replace(/\D/g, '') : null;
        const cleanedCompanyContact = companyContactNumber?.trim() ? companyContactNumber.trim().replace(/\D/g, '') : null;

        const payload = {
            SuperUserEmail: String(email).trim(),
            SuperUserFirstName: String(firstName).trim(),
            SuperUserMiddleName: middleName?.trim() || null,
            SuperUserLastName: lastName?.trim() || null,
            SuperUserContactNumber: cleanedSuContact,
            SuperUserLocation: suLocation,
            CompanyName: String(companyName).trim(),
            CompanyABN: companyABN?.trim() || null,
            ContactNumber: cleanedCompanyContact,
            CompanyLocation: companyLocation?.trim() || null,
            SubscriptionPlanId: String(planId),
            AdditionalSeatsRequested: additionalSeats
        };

        // Payment options — send plan id and optional priceId; backend will decide mapping
        const isSubscription = billingMode === 'subscription';
        const priceId = extractPriceId(selectedPlan);

        // compute amount for one-time payments (we assume one-time charges first-month total)
        const monthlyTotal = computeMonthlyTotal();
        const amountInCents = (billingMode === 'one_time') ? Math.round(Number(monthlyTotal || 0) * 100) : undefined;

        // If plan has no Stripe priceId but user selected subscription, don't block — backend may map subscriptionPlanId -> price.
        // if (isSubscription && !priceId) {
        //     // non-blocking warning (user can still proceed)
        //     NotificationManager.info('No Stripe recurring price configured for this plan on the frontend. Server will attempt to map the plan to Stripe configuration.');
        // }

        setSubmitting(true);
        try {
            const successUrl = window.location.origin + '/checkout-success';
            const cancelUrl = window.location.origin + '/checkout-cancel';
            const signInUrl = window.location.origin + '/signin';

            const paymentOptions = {
                isSubscription,
                priceId: priceId ?? null,
                subscriptionPlanId: String(planId),
                currency: 'aud',
                amountInCents: amountInCents || null,
                additionalSeats: Number(additionalSeats || 0)
            };

            await dispatch(signupUserInFirebase(payload, history, { successUrl, cancelUrl, signInUrl, paymentOptions }));
        } catch (err) {
            console.error('Onboard error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle field changes with validation
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touched.email) validateField('email', value);
    };

    const handleCompanyABNChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
        setCompanyABN(value);
        setAbnValidated(false);
        setAbnServerError('');

        if (touched.companyABN) validateField('companyABN', value);
    };

    const handleCompanyABNBlur = async () => {
        setTouched(prev => ({ ...prev, companyABN: true }));

        const localValid = validateField('companyABN', companyABN);
        if (!localValid) {
            setAbnValidated(false);
            return;
        }

        await checkAbnWithServer(companyABN);
    };

    const handleCompanyPhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setCompanyContactNumber(value);
        if (touched.companyContactNumber) validateField('companyContactNumber', value);
    };

    const handleSuperUserPhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setSuperUserContactNumber(value);
        if (touched.superUserContactNumber) validateField('superUserContactNumber', value);
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        if (touched.firstName) validateField('firstName', value);
    };

    const handleCompanyNameChange = (e) => {
        const value = e.target.value;
        setCompanyName(value);
        if (touched.companyName) validateField('companyName', value);
    };

        return (
        <QueueAnim type="bottom" duration={900}>
            <Helmet><title>Signup</title></Helmet>

            <Dialog
                open={openConfirmDialog}
                onClose={handleDialogClose}
                aria-labelledby="clear-plan-dialog-title"
                aria-describedby="clear-plan-dialog-description"
                PaperProps={{ className: classes.dialogPaper }}
                disableEscapeKeyDown={true}
                disableBackdropClick={true}
            >
                <DialogTitle id="clear-plan-dialog-title" style={{ paddingBottom: 8 }}>
                    Clear Saved Plan?
                </DialogTitle>
                <DialogContent style={{ paddingBottom: 16 }}>
                    <DialogContentText id="clear-plan-dialog-description">
                        You have a saved plan from a previous session. Would you like to clear it and start fresh with plan selection?
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ padding: '8px 24px 16px' }}>
                    <Button onClick={handleDialogNo} color="primary" variant="outlined" style={{ marginRight: 8 }} disabled={dialogLoading}>
                        No, Keep Saved Plan
                    </Button>
                    <Button onClick={handleDialogYes} color="primary" variant="contained" autoFocus disabled={dialogLoading}>
                        {dialogLoading ? 'Processing...' : 'Yes, Clear and Select New Plan'}
                    </Button>
                </DialogActions>
            </Dialog>

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
                                                    {/* Email Field */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Email"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={email}
                                                            onChange={handleEmailChange}
                                                            onBlur={handleBlur('email')}
                                                            error={touched.email && !!errors.email}
                                                            className={classes.fieldError}
                                                            required
                                                        />
                                                        {touched.email && errors.email && (
                                                            <FormHelperText error className={classes.errorText}>
                                                                {errors.email}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    {/* Company Contact Number */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Company Contact Number"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={formatAusPhone(companyContactNumber)}
                                                            onChange={handleCompanyPhoneChange}
                                                            onBlur={handleBlur('companyContactNumber')}
                                                            error={touched.companyContactNumber && !!errors.companyContactNumber}
                                                            className={classes.fieldError}
                                                            required
                                                            helperText="Aus 10-digit number (displayed as 02 8765 4321)"
                                                            inputProps={{ maxLength: 12 }}
                                                        />
                                                        {touched.companyContactNumber && errors.companyContactNumber && (
                                                            <FormHelperText error className={classes.errorText}>
                                                                {errors.companyContactNumber}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    {/* First Name */}
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            label="First Name"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={firstName}
                                                            onChange={handleFirstNameChange}
                                                            onBlur={handleBlur('firstName')}
                                                            error={touched.firstName && !!errors.firstName}
                                                            className={classes.fieldError}
                                                            required
                                                        />
                                                        {touched.firstName && errors.firstName && (
                                                            <FormHelperText error className={classes.errorText}>
                                                                {errors.firstName}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    {/* Middle Name (optional) */}
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            label="Middle Name (optional)"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={middleName}
                                                            onChange={(e) => setMiddleName(e.target.value)}
                                                        />
                                                    </Grid>

                                                    {/* Last Name */}
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            label="Last Name"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                        />
                                                    </Grid>

                                                    {/* Superuser Contact Number */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Superuser Contact Number (optional)"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={formatAusPhone(superUserContactNumber)}
                                                            onChange={handleSuperUserPhoneChange}
                                                            onBlur={handleBlur('superUserContactNumber')}
                                                            error={touched.superUserContactNumber && !!errors.superUserContactNumber}
                                                            className={classes.fieldError}
                                                            helperText="If empty, company contact number will be used."
                                                            inputProps={{ maxLength: 12 }}
                                                        />
                                                        {touched.superUserContactNumber && errors.superUserContactNumber && (
                                                            <FormHelperText error className={classes.errorText}>
                                                                {errors.superUserContactNumber}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    {/* Superuser Location (optional) – Google Autocomplete */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Superuser Location (optional)"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={superUserLocation}
                                                            onChange={(e) => setSuperUserLocation(e.target.value)}
                                                            inputRef={superUserLocationInputRef}
                                                            helperText="If empty, company location will be used."
                                                        />
                                                    </Grid>

                                                    {/* Company Name */}
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Company Name"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={companyName}
                                                            onChange={handleCompanyNameChange}
                                                            onBlur={handleBlur('companyName')}
                                                            error={touched.companyName && !!errors.companyName}
                                                            className={classes.fieldError}
                                                            required
                                                        />
                                                        {touched.companyName && errors.companyName && (
                                                            <FormHelperText error className={classes.errorText}>
                                                                {errors.companyName}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    {/* Company ABN */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Company ABN"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={companyABN}
                                                            onChange={handleCompanyABNChange}
                                                            onBlur={handleCompanyABNBlur}
                                                            error={touched.companyABN && (!!errors.companyABN || !!abnServerError)}
                                                            className={classes.fieldError}
                                                            inputProps={{ maxLength: 11 }}
                                                            helperText={
                                                                abnChecking
                                                                    ? 'Validating ABN with ABN Lookup...'
                                                                    : (abnServerError || 'Company ABN is required and will be validated')
                                                            }
                                                            required
                                                        />
                                                    </Grid>

                                                    {/* Company Location – Google Autocomplete */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Company Location (address)"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={companyLocation}
                                                            onChange={(e) => setCompanyLocation(e.target.value)}
                                                            inputRef={companyLocationInputRef}
                                                            helperText="Optional address / location of company"
                                                        />
                                                    </Grid>

                                                    {/* Additional Seats */}
                                                    <Grid item xs={12} sm={6}>
                                                        {(selectedPlan?.additionalSeatsAllowed || selectedPlan?.AdditionalSeatsAllowed) ? (
                                                            <TextField
                                                                label="Additional user seats (optional)"
                                                                variant="outlined"
                                                                fullWidth
                                                                type="number"
                                                                inputProps={{ min: 0 }}
                                                                value={additionalSeatsRequested}
                                                                onChange={(e) => {
                                                                    const v = Math.max(0, parseInt(e.target.value || '0', 10) || 0);
                                                                    setAdditionalSeatsRequested(v);
                                                                    persistAdditionalSeats(v);
                                                                }}
                                                                helperText={`Base seats: ${selectedPlan?.baseUserSeats ?? selectedPlan?.BaseUserSeats} — Extra @ AUD ${(selectedPlan?.additionalSeatPrice ?? selectedPlan?.AdditionalSeatPrice) || 0}/seat/month`}
                                                            />
                                                        ) : (
                                                            <Box px={1} py={1} borderRadius={6} bgcolor="#f8fafc"><Typography variant="body2" className={classes.smallMuted}>Additional seats for this plan must be purchased via sales / account manager.</Typography></Box>
                                                        )}
                                                    </Grid>

                                                    {/* Billing mode chooser */}
                                                    <Grid item xs={12}>
                                                        <Box mb={2} display="flex" alignItems="center" flexWrap="wrap" gap={12}>
                                                            <RadioGroup
                                                                row
                                                                aria-label="billing-mode"
                                                                name="billing-mode"
                                                                value={billingMode}
                                                                onChange={(e) => setBillingMode(e.target.value)}
                                                            >
                                                                <FormControlLabel
                                                                    value="subscription"
                                                                    control={<Radio color="primary" />}
                                                                    label="Monthly recurring (recommended)"
                                                                />
                                                                <FormControlLabel
                                                                    value="one_time"
                                                                    control={<Radio color="primary" />}
                                                                    label="One-time payment (pay now)"
                                                                />
                                                            </RadioGroup>
                                                            <Typography variant="body2" className={classes.smallMuted}>
                                                                Choose recurring if you want the plan billed automatically each month.
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} className={classes.ctaRow}>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={8}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                size="large"
                                                                onClick={onUserSignUp}
                                                                disabled={
                                                                    !selectedPlan ||
                                                                    loading ||
                                                                    submitting ||
                                                                    abnChecking ||
                                                                    Object.values(errors).some(error => error !== '') ||
                                                                    !abnValidated
                                                                }
                                                            >
                                                                {submitting ? 'Creating...' : (billingMode === 'subscription'
                                                                    ? (selectedPlan?.pricePerMonth ? `Create Company — AUD ${computeMonthlyTotal().toLocaleString()}/mo (subscribe)` : 'Create Company — Contact Sales')
                                                                    : `Create Company — Pay once — AUD ${computeMonthlyTotal().toLocaleString()}`)}
                                                            </Button>

                                                            <Button variant="outlined" onClick={clearSavedPlan} disabled={submitting}>Clear saved plan</Button>
                                                        </Box>
                                                    </Grid>

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