import axios from "axios";

// ACTION TYPES
const FETCH_NHT_REQUEST = "FETCH_NHT_REQUEST";
const FETCH_NHT_SUCCESS = "FETCH_NHT_SUCCESS";
const FETCH_NHT_FAILURE = "FETCH_NHT_FAILURE";

const UPLOAD_NHT_REQUEST = "UPLOAD_NHT_REQUEST";
const UPLOAD_NHT_SUCCESS = "UPLOAD_NHT_SUCCESS";
const UPLOAD_NHT_FAILURE = "UPLOAD_NHT_FAILURE";

// ACTION CREATORS
export const fetchNhtRequest = () => ({ type: FETCH_NHT_REQUEST });
export const fetchNhtSuccess = (data) => ({ type: FETCH_NHT_SUCCESS, payload: data });
export const fetchNhtFailure = (error) => ({ type: FETCH_NHT_FAILURE, payload: error });

export const uploadNhtRequest = () => ({ type: UPLOAD_NHT_REQUEST });
export const uploadNhtSuccess = (data) => ({ type: UPLOAD_NHT_SUCCESS, payload: data });
export const uploadNhtFailure = (error) => ({ type: UPLOAD_NHT_FAILURE, payload: error });

// THUNK: FETCH
export const fetchNhtAnalysis = () => async (dispatch) => {
  dispatch(fetchNhtRequest());
  try {
    const response = await axios.get("http://localhost:5228/api/nht/analysis");
    dispatch(fetchNhtSuccess(response.data));
  } catch (error) {
    dispatch(fetchNhtFailure(error.message));
  }
};

export const uploadNhtFile = (file) => async (dispatch) => {
  dispatch(uploadNhtRequest());
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:5228/api/nht/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(uploadNhtSuccess(response.data));
    dispatch(fetchNhtAnalysis());
  } catch (err) {
    dispatch(uploadNhtFailure(err.message));
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

// REDUCER
export default function nhtReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_NHT_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_NHT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_NHT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPLOAD_NHT_REQUEST:
      return { ...state, uploading: true, uploadError: null };
    case UPLOAD_NHT_SUCCESS:
      return { ...state, uploading: false };
    case UPLOAD_NHT_FAILURE:
      return { ...state, uploading: false, uploadError: action.payload };
    default:
      return state;
  }
}
