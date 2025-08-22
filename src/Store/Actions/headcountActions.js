import axios from "axios";

// ACTION TYPES
const FETCH_HEADCOUNT_REQUEST = "FETCH_HEADCOUNT_REQUEST";
const FETCH_HEADCOUNT_SUCCESS = "FETCH_HEADCOUNT_SUCCESS";
const FETCH_HEADCOUNT_FAILURE = "FETCH_HEADCOUNT_FAILURE";

const UPLOAD_HEADCOUNT_REQUEST = "UPLOAD_HEADCOUNT_REQUEST";
const UPLOAD_HEADCOUNT_SUCCESS = "UPLOAD_HEADCOUNT_SUCCESS";
const UPLOAD_HEADCOUNT_FAILURE = "UPLOAD_HEADCOUNT_FAILURE";

// ACTION CREATORS
export const fetchHeadcountRequest = () => ({ type: FETCH_HEADCOUNT_REQUEST });
export const fetchHeadcountSuccess = (data) => ({ type: FETCH_HEADCOUNT_SUCCESS, payload: data });
export const fetchHeadcountFailure = (error) => ({ type: FETCH_HEADCOUNT_FAILURE, payload: error });

export const uploadHeadcountRequest = () => ({ type: UPLOAD_HEADCOUNT_REQUEST });
export const uploadHeadcountSuccess = (data) => ({ type: UPLOAD_HEADCOUNT_SUCCESS, payload: data });
export const uploadHeadcountFailure = (error) => ({ type: UPLOAD_HEADCOUNT_FAILURE, payload: error });

// THUNK: FETCH
export const fetchHeadcountAnalysis = () => async (dispatch) => {
  dispatch(fetchHeadcountRequest());
  try {
    const response = await axios.get("http://localhost:5228/api/headcount/analysis");
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

    const response = await axios.post("http://localhost:5228/api/headcount/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(uploadHeadcountSuccess(response.data));
    // Optionally refresh analysis data after upload
    dispatch(fetchHeadcountAnalysis());
  } catch (error) {
    dispatch(uploadHeadcountFailure(error.message));
  }
};

// INITIAL STATE
const initialState = {
  loading: false,
  data: [],
  error: null,
  uploading: false,
  uploadError: null,
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

    default:
      return state;
  }
}
