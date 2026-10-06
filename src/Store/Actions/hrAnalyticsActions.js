import { NotificationManager } from 'react-notifications';
import { apiRequest } from 'Api/apiHelpers';

export const HR_DASHBOARD_REQUEST = 'HR_DASHBOARD_REQUEST';
export const HR_DASHBOARD_SUCCESS = 'HR_DASHBOARD_SUCCESS';
export const HR_DASHBOARD_FAILURE = 'HR_DASHBOARD_FAILURE';

export const HR_SETTINGS_REQUEST = 'HR_SETTINGS_REQUEST';
export const HR_SETTINGS_SUCCESS = 'HR_SETTINGS_SUCCESS';
export const HR_SETTINGS_FAILURE = 'HR_SETTINGS_FAILURE';

export const HR_SETTINGS_SAVE_REQUEST = 'HR_SETTINGS_SAVE_REQUEST';
export const HR_SETTINGS_SAVE_SUCCESS = 'HR_SETTINGS_SAVE_SUCCESS';
export const HR_SETTINGS_SAVE_FAILURE = 'HR_SETTINGS_SAVE_FAILURE';

export const HR_IMPORT_REQUEST = 'HR_IMPORT_REQUEST';
export const HR_IMPORT_SUCCESS = 'HR_IMPORT_SUCCESS';
export const HR_IMPORT_FAILURE = 'HR_IMPORT_FAILURE';

export const HR_EMPLOYEE_SEARCH_REQUEST = 'HR_EMPLOYEE_SEARCH_REQUEST';
export const HR_EMPLOYEE_SEARCH_SUCCESS = 'HR_EMPLOYEE_SEARCH_SUCCESS';
export const HR_EMPLOYEE_SEARCH_FAILURE = 'HR_EMPLOYEE_SEARCH_FAILURE';
export const HR_EMPLOYEE_SEARCH_CLEAR = 'HR_EMPLOYEE_SEARCH_CLEAR';

const HR_API_BASE = `${(
  process.env.REACT_APP_BASE_URL || 'http://localhost:5228/api/'
).replace(/\/+$/, '')}/hr-analytics`;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.Message ||
  error?.response?.data?.error ||
  (typeof error?.response?.data === 'string' ? error.response.data : null) ||
  error?.message ||
  fallback;

export const fetchHrDashboard = (asOfDate) => async (dispatch) => {
  dispatch({ type: HR_DASHBOARD_REQUEST });
  try {
    const params = {};
    if (asOfDate) params.asOfDate = asOfDate;

    const response = await apiRequest('get', `${HR_API_BASE}/dashboard`, null, params);
    dispatch({ type: HR_DASHBOARD_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to load HR Analytics dashboard.');
    dispatch({ type: HR_DASHBOARD_FAILURE, payload: message });
    NotificationManager.error(message);
    throw error;
  }
};

export const fetchHrSettings = () => async (dispatch) => {
  dispatch({ type: HR_SETTINGS_REQUEST });
  try {
    const response = await apiRequest('get', `${HR_API_BASE}/settings`);
    dispatch({ type: HR_SETTINGS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to load HR Analytics settings.');
    dispatch({ type: HR_SETTINGS_FAILURE, payload: message });
    NotificationManager.error(message);
    throw error;
  }
};

export const updateHrSettings = (payload) => async (dispatch) => {
  dispatch({ type: HR_SETTINGS_SAVE_REQUEST });
  try {
    const response = await apiRequest('put', `${HR_API_BASE}/settings`, payload);
    dispatch({ type: HR_SETTINGS_SAVE_SUCCESS, payload: response.data });
    NotificationManager.success('HR Analytics settings saved successfully.');
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to save HR Analytics settings.');
    dispatch({ type: HR_SETTINGS_SAVE_FAILURE, payload: message });
    NotificationManager.error(message);
    throw error;
  }
};

export const importHrWorkbook = (file) => async (dispatch) => {
  if (!file) return null;

  dispatch({ type: HR_IMPORT_REQUEST });
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiRequest('post', `${HR_API_BASE}/import`, formData);
    dispatch({ type: HR_IMPORT_SUCCESS, payload: response.data });

    const result = response.data || {};
    const warnings = Number(result.warningCount || 0);
    const message = warnings > 0
      ? `HR data imported with ${warnings} warning${warnings === 1 ? '' : 's'}.`
      : 'HR data imported successfully.';
    NotificationManager.success(message);

    return result;
  } catch (error) {
    const message = getErrorMessage(error, 'HR data import failed.');
    dispatch({ type: HR_IMPORT_FAILURE, payload: message });
    NotificationManager.error(message);
    throw error;
  }
};

export const searchHrEmployees = (query) => async (dispatch) => {
  const trimmed = String(query || '').trim();
  if (trimmed.length < 2) {
    dispatch({ type: HR_EMPLOYEE_SEARCH_CLEAR });
    return [];
  }

  dispatch({ type: HR_EMPLOYEE_SEARCH_REQUEST });
  try {
    const response = await apiRequest(
      'get',
      `${HR_API_BASE}/employees/search`,
      null,
      { q: trimmed }
    );
    dispatch({ type: HR_EMPLOYEE_SEARCH_SUCCESS, payload: response.data || [] });
    return response.data || [];
  } catch (error) {
    const message = getErrorMessage(error, 'Employee search failed.');
    dispatch({ type: HR_EMPLOYEE_SEARCH_FAILURE, payload: message });
    return [];
  }
};

export const clearHrEmployeeSearch = () => ({ type: HR_EMPLOYEE_SEARCH_CLEAR });
