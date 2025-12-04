import axios from "axios";
import { NotificationManager } from 'react-notifications';
const API_BASE_URL = process.env.REACT_APP_BASE_URL;
// ACTION TYPES
const FETCH_TERMS_REQUEST = "FETCH_TERMS_REQUEST";
const FETCH_TERMS_SUCCESS = "FETCH_TERMS_SUCCESS";
const FETCH_TERMS_FAILURE = "FETCH_TERMS_FAILURE";

const UPLOAD_TERMS_REQUEST = "UPLOAD_TERMS_REQUEST";
const UPLOAD_TERMS_SUCCESS = "UPLOAD_TERMS_SUCCESS";
const UPLOAD_TERMS_FAILURE = "UPLOAD_TERMS_FAILURE";

const UPDATE_UPLOAD_PROGRESS = "UPDATE_UPLOAD_PROGRESS";


// ACTION CREATORS
export const fetchTermsRequest = () => ({ type: FETCH_TERMS_REQUEST });
export const fetchTermsSuccess = (data) => ({ type: FETCH_TERMS_SUCCESS, payload: data });
export const fetchTermsFailure = (error) => ({ type: FETCH_TERMS_FAILURE, payload: error });

export const uploadTermsRequest = () => ({ type: UPLOAD_TERMS_REQUEST });
export const uploadTermsSuccess = (data) => ({ type: UPLOAD_TERMS_SUCCESS, payload: data });
export const uploadTermsFailure = (error) => ({ type: UPLOAD_TERMS_FAILURE, payload: error });

export const updateUploadProgress = (progress) => ({ type: UPDATE_UPLOAD_PROGRESS, payload: progress });


// THUNK: API CALL
export const fetchTermsAnalysis = () => async (dispatch) => {
  dispatch(fetchTermsRequest());
  try {
    const res = await axios.get(`${API_BASE_URL}terms/analysis`);
    dispatch(fetchTermsSuccess(res.data));
  } catch (err) {
    dispatch(fetchTermsFailure(err.message));
  }
};

export const uploadTermsFile = (file) => async (dispatch) => {
  dispatch(uploadTermsRequest());
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_BASE_URL}terms/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },

      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(updateUploadProgress(progress));
      }
    });

    dispatch(uploadTermsSuccess(res.data));
    dispatch(fetchTermsAnalysis());
    NotificationManager.success('Terms File Uploaded Successfully!');
  } catch (err) {
    dispatch(uploadTermsFailure(err.message));
    NotificationManager.error(err.message || 'Got Some ERROR');
  }
};

function _getFileNameFromContentDisposition(header) {
  if (!header) return null;
  const fileNameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(header);
  if (fileNameMatch != null && fileNameMatch[1]) {
    return fileNameMatch[1].replace(/['"]/g, '');
  }
  return null;
}

export const exportTermsAnalysis = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}terms/analysis/export`, { responseType: 'blob' });

    if (response.status === 204 || !response.data || response.data.size === 0) {
      NotificationManager.info('No turnover data available to export.');
      return;
    }

    const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
    const filename = _getFileNameFromContentDisposition(disposition) || `Turnover_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'')}.xlsx`;

    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    NotificationManager.success('Turnover analysis exported successfully.');
  } catch (err) {
    let message = 'Failed to export turnover analysis.';
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

export const exportTermsFinance = (month) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}terms/finance-analysis/export?month=${encodeURIComponent(month)}`, { responseType: 'blob' });

    if (response.status === 204 || !response.data || response.data.size === 0) {
      NotificationManager.info('No finance terms data available to export for the selected month.');
      return;
    }

    const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
    const filename = _getFileNameFromContentDisposition(disposition) || `Terms_Finance_${month}_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'')}.xlsx`;

    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    NotificationManager.success('Terms finance analysis exported successfully.');
  } catch (err) {
    let message = 'Failed to export finance terms analysis.';
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
export default function termsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TERMS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_TERMS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_TERMS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPLOAD_TERMS_REQUEST:
      return { ...state, uploading: true, uploadError: null };
    case UPLOAD_TERMS_SUCCESS:
      return { ...state, uploading: false };
    case UPLOAD_TERMS_FAILURE:
      return { ...state, uploading: false, uploadError: action.payload };

    case UPDATE_UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.payload };

    default:
      return state;
  }
}
