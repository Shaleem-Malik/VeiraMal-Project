import axios from "axios";
import { NotificationManager } from 'react-notifications';

// ACTION TYPES
const FETCH_HEADCOUNT_REQUEST = "FETCH_HEADCOUNT_REQUEST";
const FETCH_HEADCOUNT_SUCCESS = "FETCH_HEADCOUNT_SUCCESS";
const FETCH_HEADCOUNT_FAILURE = "FETCH_HEADCOUNT_FAILURE";

const UPLOAD_HEADCOUNT_REQUEST = "UPLOAD_HEADCOUNT_REQUEST";
const UPLOAD_HEADCOUNT_SUCCESS = "UPLOAD_HEADCOUNT_SUCCESS";
const UPLOAD_HEADCOUNT_FAILURE = "UPLOAD_HEADCOUNT_FAILURE";

const FETCH_FINANCE_REQUEST = "FETCH_FINANCE_REQUEST";
const FETCH_FINANCE_SUCCESS = "FETCH_FINANCE_SUCCESS";
const FETCH_FINANCE_FAILURE = "FETCH_FINANCE_FAILURE";

const UPDATE_UPLOAD_PROGRESS = "UPDATE_UPLOAD_PROGRESS";

// ACTION CREATORS
export const fetchHeadcountRequest = () => ({ type: FETCH_HEADCOUNT_REQUEST });
export const fetchHeadcountSuccess = (data) => ({ type: FETCH_HEADCOUNT_SUCCESS, payload: data });
export const fetchHeadcountFailure = (error) => ({ type: FETCH_HEADCOUNT_FAILURE, payload: error });

export const uploadHeadcountRequest = () => ({ type: UPLOAD_HEADCOUNT_REQUEST });
export const uploadHeadcountSuccess = (data) => ({ type: UPLOAD_HEADCOUNT_SUCCESS, payload: data });
export const uploadHeadcountFailure = (error) => ({ type: UPLOAD_HEADCOUNT_FAILURE, payload: error });

export const fetchFinanceRequest = () => ({ type: FETCH_FINANCE_REQUEST });
export const fetchFinanceSuccess = (data) => ({ type: FETCH_FINANCE_SUCCESS, payload: data });
export const fetchFinanceFailure = (error) => ({ type: FETCH_FINANCE_FAILURE, payload: error });

export const updateUploadProgress = (progress) => ({ type: UPDATE_UPLOAD_PROGRESS, payload: progress });

const LOCAL_BUSINESS_UNIT_KEY = 'BusinessUnit';
const TOKEN_KEY = 'token';
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// THUNK: FETCH
export const fetchHeadcountAnalysis = () => async (dispatch) => {
  dispatch(fetchHeadcountRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}headcount/analysis`);
    dispatch(fetchHeadcountSuccess(response.data));
  } catch (error) {
    dispatch(fetchHeadcountFailure(error.message));
  }
};

// THUNK: UPLOAD
export const uploadHeadcountFile = (file) => async (dispatch) => {
  dispatch(uploadHeadcountRequest());
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}headcount/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(updateUploadProgress(progress));
      }
    });

    dispatch(uploadHeadcountSuccess(response.data));
    // Optionally refresh analysis data after upload
    dispatch(fetchHeadcountAnalysis());
    NotificationManager.success('Headcount File Uploaded Successfully!');
  } catch (error) {
    dispatch(uploadHeadcountFailure(error.message));
    NotificationManager.error(error.message || 'Got Some ERROR');
  }
};

// --- NEW: THUNK for BusinessUnit Analysis
export const fetchFinanceAnalysis = (month) => async (dispatch) => {
  dispatch(fetchFinanceRequest());
  try {
    // localStorage.setItem('BusinessUnit', 'Commercial');
    // read organizational key from localStorage (BusinessUnit)
    const businessUnit = localStorage.getItem(LOCAL_BUSINESS_UNIT_KEY) || 'Finance';

    // build query params safely
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (businessUnit) params.append('organizationalKey', businessUnit);

    // attach auth header if token present
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const url = `${API_BASE_URL}headcount/finance-analysis?${params.toString()}`;

    const response = await axios.get(url, { headers });
    dispatch(fetchFinanceSuccess(response.data));
  } catch (error) {
    // prefer server message if present
    const serverMsg =
      error?.response?.data?.message ||
      error?.response?.data?.Message ||
      (typeof error?.response?.data === 'string' ? error.response.data : null);

    const errMsg = serverMsg || error.message || 'Failed to fetch finance analysis';
    dispatch(fetchFinanceFailure(errMsg));

    // show notification if NotificationManager is available
    try {
      NotificationManager.error(errMsg);
    } catch (e) {
      // ignore notification errors
    }
  }
};

// INITIAL STATE
const initialState = {
  loading: false,
  data: [],
  error: null,
  uploading: false,
  uploadError: null,
  uploadProgress: 0,

  financeLoading: false,
  financeData: [],
  financeError: null,
};

export default function headcountReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_HEADCOUNT_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_HEADCOUNT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_HEADCOUNT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPLOAD_HEADCOUNT_REQUEST:
      return { ...state, uploading: true, uploadError: null };
    case UPLOAD_HEADCOUNT_SUCCESS:
      return { ...state, uploading: false };
    case UPLOAD_HEADCOUNT_FAILURE:
      return { ...state, uploading: false, uploadError: action.payload };

    // --- NEW: Finance Cases
    case FETCH_FINANCE_REQUEST:
      return { ...state, financeLoading: true, financeError: null };
    case FETCH_FINANCE_SUCCESS:
      return { ...state, financeLoading: false, financeData: action.payload };
    case FETCH_FINANCE_FAILURE:
      return { ...state, financeLoading: false, financeError: action.payload };

    case UPDATE_UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.payload };


    default:
      return state;
  }
}
