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

/*
  NEW: Export actions that request a blob from the backend and trigger browser download.
  They don't change application state (you can extend them to track export status if desired).
*/

function _getFileNameFromContentDisposition(header) {
  if (!header) return null;
  const fileNameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(header);
  if (fileNameMatch != null && fileNameMatch[1]) {
    return fileNameMatch[1].replace(/['"]/g, '');
  }
  return null;
}

export const exportNhtAnalysis = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}nht/analysis/export`, {
      responseType: 'blob',
    });

    if (response.status === 204 || !response.data || response.data.size === 0) {
      NotificationManager.info('No analysis data available to export.');
      return;
    }

    const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
    const filename = _getFileNameFromContentDisposition(disposition) || `NHT_Analysis_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'')}.xlsx`;

    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    NotificationManager.success('Analysis exported successfully.');
  } catch (err) {
    // If backend returns JSON error, try to read message
    let message = 'Failed to export analysis.';
    if (err.response && err.response.data) {
      // try to parse error text (server might have sent JSON or text)
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const txt = reader.result;
          NotificationManager.error(txt || message);
        };
        reader.readAsText(err.response.data);
      } catch {
        NotificationManager.error(message);
      }
    } else {
      NotificationManager.error(err.message || message);
    }
  }
};

export const exportFinanceAnalysis = (month) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}nht/finance-analysis/export?month=${encodeURIComponent(month)}`, {
      responseType: 'blob',
    });

    if (response.status === 204 || !response.data || response.data.size === 0) {
      NotificationManager.info('No finance analysis data available for the selected month.');
      return;
    }

    const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
    const filename = _getFileNameFromContentDisposition(disposition) || `NHT_Finance_Analysis_${month}_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'')}.xlsx`;

    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    NotificationManager.success('Finance analysis exported successfully.');
  } catch (err) {
    let message = 'Failed to export finance analysis.';
    if (err.response && err.response.data) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const txt = reader.result;
          NotificationManager.error(txt || message);
        };
        reader.readAsText(err.response.data);
      } catch {
        NotificationManager.error(message);
      }
    } else {
      NotificationManager.error(err.message || message);
    }
  }
};

// INITIAL STATE (same as before)
const initialState = {
  loading: false,
  data: [],
  error: null,
  uploading: false,
  uploadError: null,
  uploadProgress: 0,
};

// REDUCER (unchanged)
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
