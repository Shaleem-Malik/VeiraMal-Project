// liabilityActions.js
import axios from "axios";
import { NotificationManager } from "react-notifications";
const API_BASE_URL = process.env.REACT_APP_BASE_URL || '/api/';

// ACTION TYPES
export const FETCH_LIABILITIES_REQUEST = "FETCH_LIABILITIES_REQUEST";
export const FETCH_LIABILITIES_SUCCESS = "FETCH_LIABILITIES_SUCCESS";
export const FETCH_LIABILITIES_FAILURE = "FETCH_LIABILITIES_FAILURE";

// ACTION CREATORS
export const fetchLiabilitiesRequest = () => ({ type: FETCH_LIABILITIES_REQUEST });
export const fetchLiabilitiesSuccess = (data) => ({ type: FETCH_LIABILITIES_SUCCESS, payload: data });
export const fetchLiabilitiesFailure = (error) => ({ type: FETCH_LIABILITIES_FAILURE, payload: error });

// THUNK: API CALL
export const fetchLiabilityTracker = (date) => async (dispatch) => {
  dispatch(fetchLiabilitiesRequest());
  try {
    // optional query param date=yyyy-mm-dd
    // const q = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await axios.get(`${API_BASE_URL}liability/tracker`);
    dispatch(fetchLiabilitiesSuccess(res.data));
  } catch (err) {
    const msg = err?.response?.data || err.message || 'Failed to fetch liabilities';
    dispatch(fetchLiabilitiesFailure(msg));
    NotificationManager.error(msg);
  }
};
