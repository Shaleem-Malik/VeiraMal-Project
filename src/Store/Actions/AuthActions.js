/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import firebase from 'firebase/app';
import 'firebase/auth';
import api from 'Api';
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
   RESET_PASSWORD_FAILURE
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
    const companyId = payload?.companyId ?? payload?.CompanyId ?? null;
    const userId = payload?.userId ?? payload?.UserId ?? null;

    // Save basic details
    if (access) localStorage.setItem('access', access);
    if (companyId) localStorage.setItem('companyId', companyId);
    if (userId) localStorage.setItem('userId', userId);

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

      // common claim names (support many variants)
      const candidate =
        p.businessUnits ??
        p.BusinessUnits ??
        p.businessUnit ??
        p.BusinessUnit ??
        null;

      if (Array.isArray(candidate)) {
        return candidate.map(String).map((s) => s.trim()).filter(Boolean);
      }

      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        // allow comma-separated single claim
        return candidate.split(',').map((s) => s.trim()).filter(Boolean);
      }

      // In some JWTs claims are shaped differently (e.g., repeated claim names turned into arrays)
      // Search for keys that look like business unit claims
      const keys = Object.keys(p ?? {});
      for (const k of keys) {
        if (k.toLowerCase().includes('businessunit') || k.toLowerCase().includes('businessunits')) {
          const val = p[k];
          if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
          if (typeof val === 'string' && val.trim()) return val.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }

      // fallback empty
      return [];
    };
    // Continue with existing business unit logic
    const businessUnits = extractBusinessUnitsFromPayload(payload);

    if (businessUnits && businessUnits.length > 0) {
      localStorage.setItem('businessUnits', JSON.stringify(businessUnits));
    }

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

    // Route based on access level
    routeBasedOnAccess(access, history);
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

// NEW: Function to check company assignments
const checkCompanyAssignments = async (parentCompanyId, userId) => {
  try {
    const token = localStorage.getItem('token');
    // FIX: Use the correct endpoint - remove the extra 's' from 'companies'
    const response = await api.get(`/company/${parentCompanyId}/user-assignments/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data || [];
  } catch (error) {
    console.error('Error checking company assignments:', error);
    return [];
  }
};

// NEW: Helper function for routing
const routeBasedOnAccess = (access, history) => {
  const normalizedAccess = (access || '').toString().toLowerCase();

  if (normalizedAccess === 'admin') {
    history.push('/app/dashboard/ecommerce');
  } else if (normalizedAccess === 'ceo' || normalizedAccess === 'hr') {
    history.push('/dashboard/crm/dashboard');
  } else if (
    normalizedAccess === 'superuser' ||
    normalizedAccess === 'super_user' ||
    normalizedAccess === 'super-user'
  ) {
    history.push('/agency/dashboard/agency');
  } else if (
    normalizedAccess === 'team manager' ||
    normalizedAccess === 'teammanager' ||
    normalizedAccess === 'team_manager'
  ) {
    history.push('/horizontal/dashboard/saas');
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
export const signupUserInFirebase = (user, history) => async (dispatch) => {
  dispatch({ type: SIGNUP_USER });

  // defensive getter: support nested lookup (e.g. user.selectedPlan.id)
  const get = (obj, ...keys) => {
    for (const k of keys) {
      if (!obj) continue;
      // if key is path like 'selectedPlan.subscriptionPlanId'
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
    // try many possible front-end keys for each logical field
    const SuperUserEmail = String(get(user, 'SuperUserEmail', 'superUserEmail', 'email', 'Email') ?? '').trim();
    const SuperUserFirstName = String(get(user, 'SuperUserFirstName', 'superUserFirstName', 'firstName', 'FirstName') ?? '').trim();
    const SuperUserMiddleName = (get(user, 'SuperUserMiddleName', 'superUserMiddleName', 'middleName', 'MiddleName') ?? null) || null;
    const SuperUserLastName = (get(user, 'SuperUserLastName', 'superUserLastName', 'lastName', 'LastName') ?? '') || '';

    // company & contact fields
    const CompanyName = String(get(user, 'CompanyName', 'companyName', 'company') ?? '').trim();
    const CompanyABN = (get(user, 'CompanyABN', 'companyABN', 'company_abn') ?? '') || '';
    const ContactNumber = (get(user, 'ContactNumber', 'contactNumber', 'companyContactNumber', 'company_contact') ?? '') || '';
    const CompanyLocation = (get(user, 'CompanyLocation', 'companyLocation', 'companyLocationAddress', 'companyLocation') ?? '') || '';

    // superuser contact/location (fallbacks will be applied below)
    let SuperUserContactNumber = (get(user, 'SuperUserContactNumber', 'superUserContactNumber', 'superUserPhone', 'superUserPhoneNumber') ?? '') || '';
    let SuperUserLocation = (get(user, 'SuperUserLocation', 'superUserLocation', 'location', 'userLocation') ?? '') || '';

    // plan / additional seats - may be passed as id or as an object
    let subscriptionPlanId = get(user,
      'SubscriptionPlanId', 'subscriptionPlanId', 'subscription_id', 'planId', 'selectedPlan.subscriptionPlanId',
      'selectedPlan.id', 'selectedPlan.id', 'plan.subscriptionPlanId', 'planId'
    );

    // If subscriptionPlanId is an object (selectedPlan object), try to extract common id fields
    if (subscriptionPlanId && typeof subscriptionPlanId === 'object') {
      subscriptionPlanId =
        subscriptionPlanId.subscriptionPlanId ??
        subscriptionPlanId.SubscriptionPlanId ??
        subscriptionPlanId.id ??
        subscriptionPlanId.ID ??
        subscriptionPlanId.subscriptionId ??
        null;
    }

    // also support when the entire selectedPlan is passed on the top-level `user.selectedPlan`
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

    // fallback: if superuser contact empty -> use company contact
    if (!SuperUserContactNumber && ContactNumber) SuperUserContactNumber = ContactNumber;
    if (!SuperUserLocation && CompanyLocation) SuperUserLocation = CompanyLocation;

    // Build payload exactly like backend CompanyOnboardDto expects (PascalCase)
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

    // DEBUG: print what we extracted (very helpful while diagnosing missing-field problems)
    // Remove or reduce in production if you don't want console noise
    // eslint-disable-next-line no-console
    console.info('[signupUserInFirebase] extracted payload values:', {
      SuperUserEmail, SuperUserFirstName, SuperUserMiddleName, SuperUserLastName,
      SuperUserContactNumber, SuperUserLocation, CompanyName, CompanyABN, ContactNumber, CompanyLocation,
      SubscriptionPlanId: payload.SubscriptionPlanId, AdditionalSeatsRequested: payload.AdditionalSeatsRequested
    });

    // Validate and collect missing fields for a better message
    const missing = [];
    if (!payload.SuperUserEmail) missing.push('SuperUserEmail (email)');
    if (!payload.SuperUserFirstName) missing.push('SuperUserFirstName');
    if (!payload.CompanyName) missing.push('CompanyName');
    if (!payload.SubscriptionPlanId) missing.push('SubscriptionPlanId (selected plan)');

    if (missing.length > 0) {
      const message = `Please fill required fields and select a valid plan. Missing: ${missing.join(', ')}`;
      NotificationManager.error(message);

      // Also give developer console info so you can see exactly what was passed in
      // eslint-disable-next-line no-console
      console.warn('[signupUserInFirebase] missing required fields:', missing, 'extracted payload:', payload, 'original user object:', user);

      dispatch({ type: SIGNUP_USER_FAILURE });
      // Throw so callers can catch if they want to
      throw new Error(message);
    }

    const response = await api.post('Company/onboard', payload);

    dispatch({ type: SIGNUP_USER_SUCCESS, payload: response.data });

    const successMsg = response.data?.Message || response.data?.message || 'Company created. Check your email for sign-in details.';
    NotificationManager.success(successMsg);

    if (history && typeof history.push === 'function') history.push('/signin');

    return response.data;
  } catch (err) {
    // extract server-friendly message (ModelState / ProblemDetails)
    let serverMessage = err?.response?.data?.Message || err?.response?.data?.message || null;

    // ASP.NET ProblemDetails: { errors: {...} }
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
      // fallback: stringify small objects
      try { serverMessage = JSON.stringify(err.response.data); } catch (e) { serverMessage = String(err); }
    }

    const finalMsg = serverMessage || err.message || 'Company signup failed. Please try again.';
    NotificationManager.error(finalMsg);

    dispatch({ type: SIGNUP_USER_FAILURE });
    // rethrow to let caller know the thunk failed
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
