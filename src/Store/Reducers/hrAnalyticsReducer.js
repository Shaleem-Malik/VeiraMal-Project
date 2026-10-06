import {
  HR_DASHBOARD_REQUEST,
  HR_DASHBOARD_SUCCESS,
  HR_DASHBOARD_FAILURE,
  HR_SETTINGS_REQUEST,
  HR_SETTINGS_SUCCESS,
  HR_SETTINGS_FAILURE,
  HR_SETTINGS_SAVE_REQUEST,
  HR_SETTINGS_SAVE_SUCCESS,
  HR_SETTINGS_SAVE_FAILURE,
  HR_IMPORT_REQUEST,
  HR_IMPORT_SUCCESS,
  HR_IMPORT_FAILURE,
  HR_EMPLOYEE_SEARCH_REQUEST,
  HR_EMPLOYEE_SEARCH_SUCCESS,
  HR_EMPLOYEE_SEARCH_FAILURE,
  HR_EMPLOYEE_SEARCH_CLEAR
} from 'Store/Actions/hrAnalyticsActions';

const initialState = {
  dashboard: null,
  settings: null,
  loading: false,
  settingsLoading: false,
  savingSettings: false,
  importing: false,
  importResult: null,
  searching: false,
  searchResults: [],
  error: null,
  settingsError: null,
  lastUpdatedAt: null
};

export default function hrAnalyticsReducer(state = initialState, action) {
  switch (action.type) {
    case HR_DASHBOARD_REQUEST:
      return { ...state, loading: true, error: null };
    case HR_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        dashboard: action.payload,
        settings: action.payload?.settings || state.settings,
        lastUpdatedAt: new Date().toISOString()
      };
    case HR_DASHBOARD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case HR_SETTINGS_REQUEST:
      return { ...state, settingsLoading: true, settingsError: null };
    case HR_SETTINGS_SUCCESS:
      return { ...state, settingsLoading: false, settingsError: null, settings: action.payload };
    case HR_SETTINGS_FAILURE:
      return { ...state, settingsLoading: false, settingsError: action.payload };

    case HR_SETTINGS_SAVE_REQUEST:
      return { ...state, savingSettings: true, settingsError: null };
    case HR_SETTINGS_SAVE_SUCCESS:
      return {
        ...state,
        savingSettings: false,
        settingsError: null,
        settings: action.payload,
        dashboard: state.dashboard ? { ...state.dashboard, settings: action.payload } : state.dashboard
      };
    case HR_SETTINGS_SAVE_FAILURE:
      return { ...state, savingSettings: false, settingsError: action.payload };

    case HR_IMPORT_REQUEST:
      return { ...state, importing: true, importResult: null, error: null };
    case HR_IMPORT_SUCCESS:
      return { ...state, importing: false, importResult: action.payload };
    case HR_IMPORT_FAILURE:
      return { ...state, importing: false, error: action.payload };

    case HR_EMPLOYEE_SEARCH_REQUEST:
      return { ...state, searching: true };
    case HR_EMPLOYEE_SEARCH_SUCCESS:
      return { ...state, searching: false, searchResults: action.payload || [] };
    case HR_EMPLOYEE_SEARCH_FAILURE:
      return { ...state, searching: false, searchResults: [] };
    case HR_EMPLOYEE_SEARCH_CLEAR:
      return { ...state, searching: false, searchResults: [] };

    default:
      return state;
  }
}
