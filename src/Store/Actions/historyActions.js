import axios from "axios";

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

// Save All Analysis
export const saveAllAnalysisHistory = () => async (dispatch, getState) => {
  dispatch(saveHistoryRequest());
  try {
    const state = getState();
    const headcountData = state.headcount.data || [];
    const nhtData = state.nht.data || [];
    const termsData = state.terms.data || [];

    const payload = {
      headcount: headcountData,
      nht: nhtData,
      terms: termsData,
    };

    const response = await axios.post(
      "http://localhost:5228/api/AnalysisHistory/save",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    dispatch(saveHistorySuccess(response.data));
  } catch (error) {
    dispatch(saveHistoryFailure(error.message));
  }
};

// Fetch All History List
export const fetchHistoryList = () => async (dispatch) => {
  dispatch(fetchHistoryListRequest());
  try {
    const response = await axios.get("http://localhost:5228/api/AnalysisHistory/all");
    dispatch(fetchHistoryListSuccess(response.data));
  } catch (error) {
    dispatch(fetchHistoryListFailure(error.message));
  }
};

// Fetch History Detail by ID
export const fetchHistoryDetail = (id) => async (dispatch) => {
  dispatch(fetchHistoryDetailRequest());
  try {
    const response = await axios.get(`http://localhost:5228/api/AnalysisHistory/${id}`);
    dispatch(fetchHistoryDetailSuccess(response.data));
  } catch (error) {
    dispatch(fetchHistoryDetailFailure(error.message));
  }
};
