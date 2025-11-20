/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import firebase from 'firebase/app';
import 'firebase/auth';
import api from 'Api';
import { loadStripe } from '@stripe/stripe-js';
import { NotificationManager } from 'react-notifications';
import {
   LOGIN_USER,
   LOGIN_USER_SUCCESS,
   LOGIN_USER_FAILURE,
   LOGOUT_USER,
   SIGNUP_USER,
   SIGNUP_USER_SUCCESS,
   SIGNUP_USER_FAILURE,
   // new types for reset
   RESET_PASSWORD,
   RESET_PASSWORD_SUCCESS,
   RESET_PASSWORD_FAILURE,

   FORGOT_PASSWORD,
   FORGOT_PASSWORD_SUCCESS,
   FORGOT_PASSWORD_FAILURE
} from 'Store/Actions/types';

/**
 * Redux Action To Sigin User With Firebase
 */
// (existing commented firebase signin left as-is)

// AuthActions.js (replacement for the two functions)

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // JWT uses base64url — convert to base64 then decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // pad base64 string if required
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    // ignore decode errors
    return null;
  }
}

/**
 * signinUserInFirebase - updated to support multi business-units selection
 * Expects `api`, `NotificationManager`, action types and `dispatch` to be available in this module.
 */
// AuthActions.js - Update the signinUserInFirebase function

// ... (keep your decodeJwtPayload function as-is)

export const signinUserInFirebase = (user, history) => async (dispatch) => {
  dispatch({ type: LOGIN_USER });

  try {
    const response = await api.post('Auth/login', {
      email: user.email,
      password: user.password,
    });

    const token = response?.data?.token ?? response?.data?.Token;
    const mustReset = response?.data?.mustResetPassword ?? response?.data?.MustResetPassword ?? false;

    if (!token) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error('Authentication failed: no token received.');
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user_email', user.email ?? '');

    if (mustReset === true) {
      NotificationManager.info('You must reset your password on first login.');
      dispatch({ type: LOGIN_USER_SUCCESS, payload: user.email });
      history.push('/reset-password');
      return;
    }

    const payload = decodeJwtPayload(token) || {};
    const access = payload?.access ?? payload?.Access ?? null;
    const name = payload?.firstName ?? null;
    const companyId = payload?.companyId ?? payload?.CompanyId ?? null;
    const userId = payload?.userId ?? payload?.UserId ?? null;

    // Save basic details
    if (access) localStorage.setItem('access', access);
    if (companyId) localStorage.setItem('companyId', companyId);
    if (userId) localStorage.setItem('userId', userId);
    if (name) localStorage.setItem('name', name);

    // NEW: Check company assignments for superusers
    if (access && access.toLowerCase() === 'superuser' && companyId && userId) {
      try {
        const assignments = await checkCompanyAssignments(companyId, userId);

        if (assignments.length > 1) {
          // Multiple assignments - redirect to company selection
          localStorage.setItem('availableCompanies', JSON.stringify(assignments));
          localStorage.setItem('postLoginChooseCompany', '1');
          dispatch({ type: LOGIN_USER_SUCCESS, payload: user.email });
          history.push('/choose-company');
          return;
        } else if (assignments.length === 1) {
          // Single assignment - auto-select it
          localStorage.setItem('selectedCompanyId', assignments[0].companyId);
          localStorage.setItem('selectedCompanyName', assignments[0].companyName);
        }
        // No assignments or single assignment - continue normal flow
      } catch (error) {
        console.warn('Failed to check company assignments:', error);
        // Continue with normal flow if assignment check fails
      }
    }

    const extractBusinessUnitsFromPayload = (p) => {
      if (!p) return [];

      const candidate =
        p.businessUnits ?? p.BusinessUnits ?? p.businessUnit ?? p.BusinessUnit ?? null;

      if (Array.isArray(candidate)) {
        return candidate.map(String).map((s) => s.trim()).filter(Boolean);
      }

      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.split(',').map((s) => s.trim()).filter(Boolean);
      }

      const keys = Object.keys(p ?? {});
      for (const k of keys) {
        if (k.toLowerCase().includes('businessunit') || k.toLowerCase().includes('businessunits')) {
          const val = p[k];
          if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
          if (typeof val === 'string' && val.trim()) return val.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }

      return [];
    };

    const businessUnits = extractBusinessUnitsFromPayload(payload);

    if (businessUnits && businessUnits.length > 0) {
      localStorage.setItem('businessUnits', JSON.stringify(businessUnits));
    }

    // ----- NEW: parse isFirstLogin (support response body or JWT claim) -----
    let isFirstLogin = false;
    const respFlag = response?.data?.isFirstLogin ?? response?.data?.IsFirstLogin;
    if (typeof respFlag === 'boolean') {
      isFirstLogin = respFlag;
    } else if (typeof respFlag === 'string') {
      isFirstLogin = respFlag.toLowerCase() === 'true';
    } else {
      const claim = payload?.isFirstLogin ?? payload?.IsFirstLogin;
      if (typeof claim === 'boolean') {
        isFirstLogin = claim;
      } else if (typeof claim === 'string') {
        isFirstLogin = claim.toLowerCase() === 'true';
      } else {
        isFirstLogin = false;
      }
    }
    // ----------------------------------------------------------------------

    dispatch({ type: LOGIN_USER_SUCCESS, payload: user.email });

    // Handle business unit selection (existing logic)
    if (businessUnits.length > 1) {
      localStorage.setItem('postLoginChooseBU', '1');
      NotificationManager.info('Please select the business unit you want to use for this session.');
      history.push('/choose-business-unit');
      return;
    }

    if (businessUnits.length === 1) {
      localStorage.setItem('BusinessUnit', businessUnits[0]);
      localStorage.removeItem('businessUnits');
      localStorage.removeItem('postLoginChooseBU');
    } else {
      localStorage.removeItem('BusinessUnit');
    }

    // Route based on access level AND isFirstLogin for superuser
    routeBasedOnAccess(access, history, isFirstLogin);
    NotificationManager.success('User Login Successfully!');

  } catch (error) {
    console.error('Login error:', error);
    dispatch({ type: LOGIN_USER_FAILURE });

    const serverMessage = error?.response?.data?.message ??
                          error?.response?.data?.Message ??
                          error?.message ??
                          'Login failed';
    NotificationManager.error(serverMessage);
  }
};

// NEW: Function to check company assignments (same as you already had)
const checkCompanyAssignments = async (parentCompanyId, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/company/${parentCompanyId}/user-assignments/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data || [];
  } catch (error) {
    console.error('Error checking company assignments:', error);
    return [];
  }
};

// UPDATED: Helper function for routing (accepts isFirstLogin)
const routeBasedOnAccess = (access, history, isFirstLogin = false) => {
  const normalizedAccess = (access || '').toString().toLowerCase();

  if (normalizedAccess === 'admin') {
    history.push('/app/dashboard/ecommerce');
  } else if (normalizedAccess === 'ceo' || normalizedAccess === 'hr') {
    history.push('/app/crm/dashboard');
  } else if (
    normalizedAccess === 'superuser' ||
    normalizedAccess === 'super_user' ||
    normalizedAccess === 'super-user'
  ) {
    // NEW: superuser routing based on isFirstLogin
    if (isFirstLogin) {
      history.push('/app/dashboard/agency');
    } else {
      history.push('/app/dashboard/ecommerce');
    }
  } else if (
    normalizedAccess === 'team manager' ||
    normalizedAccess === 'teammanager' ||
    normalizedAccess === 'team_manager'
  ) {
    history.push('/app/dashboard/saas');
  } else {
    history.push('/app/dashboard/ecommerce');
  }
};



/**
 * Reset Password action
 * newPassword: string
 * history: react-router history object (for redirect)
 */
export const resetPassword = (newPassword, history) => async (dispatch) => {
   dispatch({ type: RESET_PASSWORD });

   const token = localStorage.getItem('token');
   if (!token) {
      dispatch({ type: RESET_PASSWORD_FAILURE });
      NotificationManager.error('Authentication token missing. Please sign in again.');
      history.push('/signin');
      return;
   }

   try {
      // call backend reset endpoint; include Authorization header explicitly
      await api.post('Auth/reset-password', { newPassword }, {
         headers: { Authorization: `Bearer ${token}` }
      });

      dispatch({ type: RESET_PASSWORD_SUCCESS });
      NotificationManager.success('Password updated successfully. Please sign in with your new password.');

      // Remove auth token & user info
      localStorage.removeItem('token');
      localStorage.removeItem('access');
      localStorage.removeItem('user_email');
      localStorage.removeItem('userId');
      localStorage.removeItem('companyId');

      history.push('/signin');
   } catch (err) {
      console.error('Reset password error:', err);
      dispatch({ type: RESET_PASSWORD_FAILURE });

      const msg = err?.response?.data?.message || err?.response?.data?.Message || err?.response?.data || err.message || 'Password reset failed.';
      NotificationManager.error(msg);
   }
};

/**
 * Forgot Password action
 * email: string
 * history: optional react-router history object (for redirect)
 */
export const forgotPassword = (email, history) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD });

  if (!email || String(email).trim().length === 0) {
    dispatch({ type: FORGOT_PASSWORD_FAILURE });
    NotificationManager.error('Please enter your registered email address.');
    return;
  }

  try {
    const body = { email: String(email).trim() };
    const response = await api.post('Auth/forgot-password', body);

    // expected response: { Message: "Temporary password has been sent..." } or similar
    const successMsg = response?.data?.Message ?? response?.data?.message ?? 'If an account exists, a temporary password has been sent to the registered email.';
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: { email: body.email } });
    NotificationManager.success(successMsg);

    // Optionally redirect to signin or a "check your email" page
    if (history && typeof history.push === 'function') {
      // choose where you want to send the user; '/signin' is typical
      history.push('/signin');
    }

    return response.data;
  } catch (err) {
    // extract server-friendly message (ModelState / ProblemDetails)
    let serverMessage = err?.response?.data?.Message || err?.response?.data?.message || null;

    if (!serverMessage && err?.response?.data?.errors) {
      const parts = [];
      const errors = err.response.data.errors;
      for (const k of Object.keys(errors)) {
        if (Array.isArray(errors[k])) parts.push(...errors[k]);
        else parts.push(String(errors[k]));
      }
      serverMessage = parts.join(' ; ');
    }

    if (!serverMessage && err?.response?.data) {
      try { serverMessage = JSON.stringify(err.response.data); } catch (e) { serverMessage = String(err); }
    }

    const finalMsg = serverMessage || err.message || 'Password reset request failed. Please try again.';
    dispatch({ type: FORGOT_PASSWORD_FAILURE });
    NotificationManager.error(finalMsg);

    throw err;
  }
};


/**
 * Redux Action To Signout User From  Firebase
 */
export const logoutUserFromFirebase = (history) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // call backend to revoke
      await api.post('Auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (err) {
    // ignore errors from backend logout (we still want to clear client state)
    console.warn('Backend logout failed (continuing):', err);
  } finally {
    // firebase sign out if used
    try { if (firebase?.auth) await firebase.auth().signOut(); } catch (e) { /* ignore */ }

    // clear localStorage keys used
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    localStorage.removeItem('user_email');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedCompanyName');
    localStorage.removeItem('availableCompanies');
    localStorage.removeItem('businessUnits');
    localStorage.removeItem('BusinessUnit');
    localStorage.removeItem('postLoginChooseCompany');
    localStorage.removeItem('postLoginChooseBU');

    dispatch({ type: LOGOUT_USER });
    NotificationManager.success('Logged out successfully.');
    if (history && typeof history.push === 'function') history.push('/signin');
  }
};


/**
 * Redux Action To Signup User In Firebase
 */
/**
 * Redux Action To Signup User In Firebase (onboard company)
 */
export const signupUserInFirebase = (user, history, urls = {}) => async (dispatch) => {
  dispatch({ type: SIGNUP_USER });

  // defensive getter: support nested lookup (e.g. user.selectedPlan.id)
  const get = (obj, ...keys) => {
    for (const k of keys) {
      if (!obj) continue;
      if (k.includes('.')) {
        const parts = k.split('.');
        let cur = obj;
        for (const p of parts) {
          if (cur && (p in cur)) cur = cur[p];
          else { cur = undefined; break; }
        }
        if (cur !== undefined && cur !== null) return cur;
      } else {
        if (k in obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
      }
    }
    return null;
  };

  try {
    // Extract fields (keeps your compatibility)
    const SuperUserEmail = String(get(user, 'SuperUserEmail', 'superUserEmail', 'email', 'Email') ?? '').trim();
    const SuperUserFirstName = String(get(user, 'SuperUserFirstName', 'superUserFirstName', 'firstName', 'FirstName') ?? '').trim();
    const SuperUserMiddleName = (get(user, 'SuperUserMiddleName', 'superUserMiddleName', 'middleName', 'MiddleName') ?? null) || null;
    const SuperUserLastName = (get(user, 'SuperUserLastName', 'superUserLastName', 'lastName', 'LastName') ?? '') || '';

    const CompanyName = String(get(user, 'CompanyName', 'companyName', 'company') ?? '').trim();
    const CompanyABN = (get(user, 'CompanyABN', 'companyABN', 'company_abn') ?? '') || '';
    const ContactNumber = (get(user, 'ContactNumber', 'contactNumber', 'companyContactNumber', 'company_contact') ?? '') || '';
    const CompanyLocation = (get(user, 'CompanyLocation', 'companyLocation', 'companyLocationAddress', 'companyLocation') ?? '') || '';

    let SuperUserContactNumber = (get(user, 'SuperUserContactNumber', 'superUserContactNumber', 'superUserPhone', 'superUserPhoneNumber') ?? '') || '';
    let SuperUserLocation = (get(user, 'SuperUserLocation', 'superUserLocation', 'location', 'userLocation') ?? '') || '';

    let subscriptionPlanId = get(user,
      'SubscriptionPlanId', 'subscriptionPlanId', 'subscription_id', 'planId', 'selectedPlan.subscriptionPlanId',
      'selectedPlan.id', 'selectedPlan.id', 'plan.subscriptionPlanId', 'planId'
    );

    if (subscriptionPlanId && typeof subscriptionPlanId === 'object') {
      subscriptionPlanId =
        subscriptionPlanId.subscriptionPlanId ??
        subscriptionPlanId.SubscriptionPlanId ??
        subscriptionPlanId.id ??
        subscriptionPlanId.ID ??
        subscriptionPlanId.subscriptionId ??
        null;
    }

    if (!subscriptionPlanId) {
      const sel = get(user, 'selectedPlan', 'selected_plan', 'plan');
      if (sel) {
        subscriptionPlanId =
          sel.subscriptionPlanId ??
          sel.SubscriptionPlanId ??
          sel.id ??
          sel.ID ??
          sel.subscriptionId ??
          sel.value ??
          null;
      }
    }

    const AdditionalSeatsRequested = Number(get(user, 'AdditionalSeatsRequested', 'additionalSeatsRequested', 'additionalSeats', 'additional') ?? 0) || 0;

    if (!SuperUserContactNumber && ContactNumber) SuperUserContactNumber = ContactNumber;
    if (!SuperUserLocation && CompanyLocation) SuperUserLocation = CompanyLocation;

    const payload = {
      SuperUserEmail,
      SuperUserFirstName,
      SuperUserMiddleName,
      SuperUserLastName,
      SuperUserContactNumber,
      SuperUserLocation,
      CompanyName,
      CompanyABN,
      ContactNumber,
      CompanyLocation,
      SubscriptionPlanId: subscriptionPlanId ? String(subscriptionPlanId) : '',
      AdditionalSeatsRequested: Number(AdditionalSeatsRequested)
    };

    // DEBUG (you can keep or remove)
    console.info('[signupUserInFirebase] extracted payload values:', {
      SuperUserEmail, SuperUserFirstName, SuperUserMiddleName, SuperUserLastName,
      SuperUserContactNumber, SuperUserLocation, CompanyName, CompanyABN, ContactNumber, CompanyLocation,
      SubscriptionPlanId: payload.SubscriptionPlanId, AdditionalSeatsRequested: payload.AdditionalSeatsRequested
    });

    // validate required
    const missing = [];
    if (!payload.SuperUserEmail) missing.push('SuperUserEmail (email)');
    if (!payload.SuperUserFirstName) missing.push('SuperUserFirstName');
    if (!payload.CompanyName) missing.push('CompanyName');
    if (!payload.SubscriptionPlanId) missing.push('SubscriptionPlanId (selected plan)');

    if (missing.length > 0) {
      const message = `Please fill required fields and select a valid plan. Missing: ${missing.join(', ')}`;
      NotificationManager.error(message);
      dispatch({ type: SIGNUP_USER_FAILURE });
      throw new Error(message);
    }

    // Build request body for your backend CompaniesController
    const successUrl = (urls && urls.successUrl) || (window.location.origin + '/checkout-success');
    const cancelUrl = (urls && urls.cancelUrl) || (window.location.origin + '/checkout-cancel');
    const signInUrl = (urls && urls.signInUrl) || (window.location.origin + '/signin');

    const requestBody = {
      Dto: payload,
      SuccessUrl: successUrl,
      CancelUrl: cancelUrl,
      SignInUrl: signInUrl,
      Currency: 'aud'
    };

    // Try two common endpoint forms (some codebases use capitalized route or plural)
    let response;
    try {
      response = await api.post('Company/onboard', requestBody);
    } catch (err) {
      // if first endpoint failed, try alternate casing — helpful for legacy controllers
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        response = await api.post('Company/onboard', requestBody);
      } else {
        throw err;
      }
    }

    // Response expected: { sessionId, url } from CompaniesController
    const data = response.data || {};

    // If the backend returned a sessionId/url, redirect to Stripe Checkout
    if (data.sessionId || data.url) {
      const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        NotificationManager.error('Stripe publishable key missing in frontend environment. Contact the administrator.');
        dispatch({ type: SIGNUP_USER_FAILURE });
        throw new Error('Missing REACT_APP_STRIPE_PUBLISHABLE_KEY');
      }

      // Try to use Stripe's redirectToCheckout. If loadStripe fails, fallback to opening url.
      try {
        const stripe = await loadStripe(publishableKey);
        if (stripe && data.sessionId) {
          // this will redirect the user away (and not return unless there's an error)
          const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (result && result.error) {
            // redirectToCheckout failed - fallback to the returned URL if available
            console.error('stripe.redirectToCheckout error', result.error);
            if (data.url) window.location.href = data.url;
            else NotificationManager.error(result.error.message || 'Stripe checkout start failed.');
          }
        } else {
          // fallback: navigate to the session URL returned by server
          if (data.url) window.location.href = data.url;
          else {
            NotificationManager.error('Unable to start Stripe checkout. No session id or url was returned.');
            dispatch({ type: SIGNUP_USER_FAILURE });
            throw new Error('Missing sessionId and url from server response');
          }
        }
      } catch (err) {
        console.error('Stripe start error', err);
        if (data.url) window.location.href = data.url;
        else {
          NotificationManager.error('Failed to start Stripe checkout.');
          dispatch({ type: SIGNUP_USER_FAILURE });
          throw err;
        }
      }

      // Do NOT dispatch success here because user will be redirected to Stripe.
      // But to keep Redux state consistent, we can mark success locally:
      dispatch({ type: SIGNUP_USER_SUCCESS, payload: data });
      return data;
    }

    // If no sessionId/url returned, fall back to legacy behavior (server may have completed onboarding synchronously)
    dispatch({ type: SIGNUP_USER_SUCCESS, payload: response.data });

    const successMsg = response.data?.Message || response.data?.message || 'Company created. Check your email for sign-in details.';
    NotificationManager.success(successMsg);

    if (history && typeof history.push === 'function') {
      history.push('/signin');
    }

    return response.data;
  } catch (err) {
    // extract server-friendly message (ModelState / ProblemDetails)
    let serverMessage = err?.response?.data?.Message || err?.response?.data?.message || null;

    if (!serverMessage && err?.response?.data?.errors) {
      const parts = [];
      const errors = err.response.data.errors;
      for (const k of Object.keys(errors)) {
        if (Array.isArray(errors[k])) parts.push(...errors[k]);
        else parts.push(String(errors[k]));
      }
      serverMessage = parts.join(' ; ');
    }

    if (!serverMessage && err?.response?.data) {
      try { serverMessage = JSON.stringify(err.response.data); } catch (e) { serverMessage = String(err); }
    }

    const finalMsg = serverMessage || err.message || 'Company signup failed. Please try again.';
    NotificationManager.error(finalMsg);

    dispatch({ type: SIGNUP_USER_FAILURE });
    throw err;
  }
};


/**
 * Redux Action To Signin User In Firebase With Facebook
 */
export const signinUserWithFacebook = (history) => (dispatch) => {
   dispatch({ type: LOGIN_USER });
   const provider = new firebase.auth.FacebookAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function (result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
      history.push('/');
      NotificationManager.success(`Hi ${result.user.displayName}!`);
   }).catch(function (error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
   });
}

/**
 * Redux Action To Signin User In Firebase With Google
 */
export const signinUserWithGoogle = (history) => (dispatch) => {
   dispatch({ type: LOGIN_USER });
   const provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function (result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
      history.push('/');
      NotificationManager.success(`Hi ${result.user.displayName}!`);
   }).catch(function (error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
   });
}

/**
 * Redux Action To Signin User In Firebase With Github
 */
export const signinUserWithGithub = (history) => (dispatch) => {
   dispatch({ type: LOGIN_USER });
   const provider = new firebase.auth.GithubAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function (result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
      history.push('/');
      NotificationManager.success(`Hi ${result.user.displayName}!`);
   }).catch(function (error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
   });
}

/**
 * Redux Action To Signin User In Firebase With Twitter
 */
export const signinUserWithTwitter = (history) => (dispatch) => {
   dispatch({ type: LOGIN_USER });
   const provider = new firebase.auth.TwitterAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function (result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
      history.push('/');
      NotificationManager.success('User Login Successfully!');
   }).catch(function (error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
   });
}
