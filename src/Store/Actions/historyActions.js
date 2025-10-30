import axios from "axios";
import { NotificationManager } from 'react-notifications';
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// Action Types
export const SAVE_HISTORY_REQUEST = "SAVE_HISTORY_REQUEST";
export const SAVE_HISTORY_SUCCESS = "SAVE_HISTORY_SUCCESS";
export const SAVE_HISTORY_FAILURE = "SAVE_HISTORY_FAILURE";

export const FETCH_HISTORY_LIST_REQUEST = "FETCH_HISTORY_LIST_REQUEST";
export const FETCH_HISTORY_LIST_SUCCESS = "FETCH_HISTORY_LIST_SUCCESS";
export const FETCH_HISTORY_LIST_FAILURE = "FETCH_HISTORY_LIST_FAILURE";

export const FETCH_HISTORY_DETAIL_REQUEST = "FETCH_HISTORY_DETAIL_REQUEST";
export const FETCH_HISTORY_DETAIL_SUCCESS = "FETCH_HISTORY_DETAIL_SUCCESS";
export const FETCH_HISTORY_DETAIL_FAILURE = "FETCH_HISTORY_DETAIL_FAILURE";

export const FETCH_CEO_YTD_REQUEST = "FETCH_CEO_YTD_REQUEST";
export const FETCH_CEO_YTD_SUCCESS = "FETCH_CEO_YTD_SUCCESS";
export const FETCH_CEO_YTD_FAILURE = "FETCH_CEO_YTD_FAILURE";


export const fetchCeoYtdRequest = () => ({ type: FETCH_CEO_YTD_REQUEST });
export const fetchCeoYtdSuccess = (data) => ({ type: FETCH_CEO_YTD_SUCCESS, payload: data });
export const fetchCeoYtdFailure = (err) => ({ type: FETCH_CEO_YTD_FAILURE, payload: err });

// Save Actions
export const saveHistoryRequest = () => ({ type: SAVE_HISTORY_REQUEST });
export const saveHistorySuccess = (data) => ({
  type: SAVE_HISTORY_SUCCESS,
  payload: data,
});
export const saveHistoryFailure = (error) => ({
  type: SAVE_HISTORY_FAILURE,
  payload: error,
});

// List Actions
export const fetchHistoryListRequest = () => ({ type: FETCH_HISTORY_LIST_REQUEST });
export const fetchHistoryListSuccess = (data) => ({
  type: FETCH_HISTORY_LIST_SUCCESS,
  payload: data,
});
export const fetchHistoryListFailure = (error) => ({
  type: FETCH_HISTORY_LIST_FAILURE,
  payload: error,
});

// Detail Actions
export const fetchHistoryDetailRequest = () => ({ type: FETCH_HISTORY_DETAIL_REQUEST });
export const fetchHistoryDetailSuccess = (data) => ({
  type: FETCH_HISTORY_DETAIL_SUCCESS,
  payload: data,
});
export const fetchHistoryDetailFailure = (error) => ({
  type: FETCH_HISTORY_DETAIL_FAILURE,
  payload: error,
});

export const fetchCeoYtdAnalysis = () => async (dispatch) => {
  dispatch(fetchCeoYtdRequest());
  try {
    const res = await axios.get(`${API_BASE_URL}AnalysisHistory/ceo/ytd`);
    dispatch(fetchCeoYtdSuccess(res.data));
  } catch (error) {
    dispatch(fetchCeoYtdFailure(error.message));
  }
};

// Save All Analysis
export const saveAllAnalysisHistory = (isFinal, year, month) => async (dispatch, getState) => {
  dispatch(saveHistoryRequest());
  try {
    const state = getState();
    const uploadedTypes = JSON.parse(localStorage.getItem("uploadedFiles")) || [];

    const payload = {
      isFinal,
      year,
      month
    };

    if (uploadedTypes.includes("headcount")) {
      payload.headcount = state.headcount.data || [];
    }
    if (uploadedTypes.includes("nht")) {
      payload.nht = state.nht.data || [];
    }
    if (uploadedTypes.includes("terms")) {
      payload.terms = state.terms.data || [];
    }

    const response = await axios.post(
      `${API_BASE_URL}AnalysisHistory/save`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    dispatch(saveHistorySuccess(response.data));
    NotificationManager.success('Snapshot Saved Successfully!');
  } catch (error) {
    dispatch(saveHistoryFailure(error.message));
    NotificationManager.error(error.message || 'Got some error while saving snapshot')
  }
};



// Fetch All History List
export const fetchHistoryList = () => async (dispatch) => {
  dispatch(fetchHistoryListRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}AnalysisHistory/all`);
    dispatch(fetchHistoryListSuccess(response.data));
  } catch (error) {
    dispatch(fetchHistoryListFailure(error.message));
  }
};

// Fetch History Detail by ID
export const fetchHistoryDetail = (id) => async (dispatch) => {
  dispatch(fetchHistoryDetailRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}AnalysisHistory/${id}`);
    dispatch(fetchHistoryDetailSuccess(response.data));
  } catch (error) {
    dispatch(fetchHistoryDetailFailure(error.message));
  }
};
