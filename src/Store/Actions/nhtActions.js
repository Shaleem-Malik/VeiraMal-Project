import axios from "axios";
import { NotificationManager } from 'react-notifications';
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// ACTION TYPES
const FETCH_NHT_REQUEST = "FETCH_NHT_REQUEST";
const FETCH_NHT_SUCCESS = "FETCH_NHT_SUCCESS";
const FETCH_NHT_FAILURE = "FETCH_NHT_FAILURE";

const UPLOAD_NHT_REQUEST = "UPLOAD_NHT_REQUEST";
const UPLOAD_NHT_SUCCESS = "UPLOAD_NHT_SUCCESS";
const UPLOAD_NHT_FAILURE = "UPLOAD_NHT_FAILURE";

const UPDATE_UPLOAD_PROGRESS = "UPDATE_UPLOAD_PROGRESS";


// ACTION CREATORS
export const fetchNhtRequest = () => ({ type: FETCH_NHT_REQUEST });
export const fetchNhtSuccess = (data) => ({ type: FETCH_NHT_SUCCESS, payload: data });
export const fetchNhtFailure = (error) => ({ type: FETCH_NHT_FAILURE, payload: error });

export const uploadNhtRequest = () => ({ type: UPLOAD_NHT_REQUEST });
export const uploadNhtSuccess = (data) => ({ type: UPLOAD_NHT_SUCCESS, payload: data });
export const uploadNhtFailure = (error) => ({ type: UPLOAD_NHT_FAILURE, payload: error });

export const updateUploadProgress = (progress) => ({ type: UPDATE_UPLOAD_PROGRESS, payload: progress });

// THUNK: FETCH
export const fetchNhtAnalysis = () => async (dispatch) => {
  dispatch(fetchNhtRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}nht/analysis`);
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

    const response = await axios.post(`${API_BASE_URL}nht/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(updateUploadProgress(progress));
      }
    });

    dispatch(uploadNhtSuccess(response.data));
    dispatch(fetchNhtAnalysis());
    NotificationManager.success('NHT File Uploaded Successfully!');
  } catch (err) {
    dispatch(uploadNhtFailure(err.message));
    NotificationManager.error(err.message || 'Got Some ERROR');
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

    case UPDATE_UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.payload };
    default:
      return state;
  }
}
