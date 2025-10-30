import { NotificationManager } from "react-notifications";
import { apiWithCompany, apiRequest } from 'Api/apiHelpers'; // Import the new helpers

// ========================
// ACTION TYPES
// ========================
const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";

const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

const ACTIVATE_USER_REQUEST = "ACTIVATE_USER_REQUEST";
const ACTIVATE_USER_SUCCESS = "ACTIVATE_USER_SUCCESS";
const ACTIVATE_USER_FAILURE = "ACTIVATE_USER_FAILURE";

const INACTIVATE_USER_REQUEST = "INACTIVATE_USER_REQUEST";
const INACTIVATE_USER_SUCCESS = "INACTIVATE_USER_SUCCESS";
const INACTIVATE_USER_FAILURE = "INACTIVATE_USER_FAILURE";

const UPLOAD_USERS_REQUEST = "UPLOAD_USERS_REQUEST";
const UPLOAD_USERS_SUCCESS = "UPLOAD_USERS_SUCCESS";
const UPLOAD_USERS_FAILURE = "UPLOAD_USERS_FAILURE";
const UPDATE_UPLOAD_PROGRESS = "UPDATE_UPLOAD_PROGRESS";

const FETCH_BUSINESS_UNITS_REQUEST = "FETCH_BUSINESS_UNITS_REQUEST";
const FETCH_BUSINESS_UNITS_SUCCESS = "FETCH_BUSINESS_UNITS_SUCCESS";
const FETCH_BUSINESS_UNITS_FAILURE = "FETCH_BUSINESS_UNITS_FAILURE";

const ADD_BUSINESS_UNIT_REQUEST = "ADD_BUSINESS_UNIT_REQUEST";
const ADD_BUSINESS_UNIT_SUCCESS = "ADD_BUSINESS_UNIT_SUCCESS";
const ADD_BUSINESS_UNIT_FAILURE = "ADD_BUSINESS_UNIT_FAILURE";

const FETCH_ACCESS_LEVELS_REQUEST = "FETCH_ACCESS_LEVELS_REQUEST";
const FETCH_ACCESS_LEVELS_SUCCESS = "FETCH_ACCESS_LEVELS_SUCCESS";
const FETCH_ACCESS_LEVELS_FAILURE = "FETCH_ACCESS_LEVELS_FAILURE";

const ADD_ACCESS_LEVEL_REQUEST = "ADD_ACCESS_LEVEL_REQUEST";
const ADD_ACCESS_LEVEL_SUCCESS = "ADD_ACCESS_LEVEL_SUCCESS";
const ADD_ACCESS_LEVEL_FAILURE = "ADD_ACCESS_LEVEL_FAILURE";

// ========================
// ACTION CREATORS
// ========================
export const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });
export const fetchUsersSuccess = (data) => ({ type: FETCH_USERS_SUCCESS, payload: data });
export const fetchUsersFailure = (error) => ({ type: FETCH_USERS_FAILURE, payload: error });

export const createUserRequest = () => ({ type: CREATE_USER_REQUEST });
export const createUserSuccess = (data) => ({ type: CREATE_USER_SUCCESS, payload: data });
export const createUserFailure = (error) => ({ type: CREATE_USER_FAILURE, payload: error });

export const updateUserRequest = () => ({ type: UPDATE_USER_REQUEST });
export const updateUserSuccess = (data) => ({ type: UPDATE_USER_SUCCESS, payload: data });
export const updateUserFailure = (error) => ({ type: UPDATE_USER_FAILURE, payload: error });

export const activateUserRequest = () => ({ type: ACTIVATE_USER_REQUEST });
export const activateUserSuccess = (id) => ({ type: ACTIVATE_USER_SUCCESS, payload: id });
export const activateUserFailure = (error) => ({ type: ACTIVATE_USER_FAILURE, payload: error });

export const inactivateUserRequest = () => ({ type: INACTIVATE_USER_REQUEST });
export const inactivateUserSuccess = (id) => ({ type: INACTIVATE_USER_SUCCESS, payload: id });
export const inactivateUserFailure = (error) => ({ type: INACTIVATE_USER_FAILURE, payload: error });

export const uploadUsersRequest = () => ({ type: UPLOAD_USERS_REQUEST });
export const uploadUsersSuccess = (data) => ({ type: UPLOAD_USERS_SUCCESS, payload: data });
export const uploadUsersFailure = (error) => ({ type: UPLOAD_USERS_FAILURE, payload: error });
export const updateUploadProgress = (progress) => ({ type: UPDATE_UPLOAD_PROGRESS, payload: progress });

export const fetchBusinessUnitsRequest = () => ({ type: FETCH_BUSINESS_UNITS_REQUEST });
export const fetchBusinessUnitsSuccess = (data) => ({ type: FETCH_BUSINESS_UNITS_SUCCESS, payload: data });
export const fetchBusinessUnitsFailure = (error) => ({ type: FETCH_BUSINESS_UNITS_FAILURE, payload: error });

export const addBusinessUnitRequest = () => ({ type: ADD_BUSINESS_UNIT_REQUEST });
export const addBusinessUnitSuccess = (data) => ({ type: ADD_BUSINESS_UNIT_SUCCESS, payload: data });
export const addBusinessUnitFailure = (error) => ({ type: ADD_BUSINESS_UNIT_FAILURE, payload: error });

export const fetchAccessLevelsRequest = () => ({ type: FETCH_ACCESS_LEVELS_REQUEST });
export const fetchAccessLevelsSuccess = (data) => ({ type: FETCH_ACCESS_LEVELS_SUCCESS, payload: data });
export const fetchAccessLevelsFailure = (error) => ({ type: FETCH_ACCESS_LEVELS_FAILURE, payload: error });

export const addAccessLevelRequest = () => ({ type: ADD_ACCESS_LEVEL_REQUEST });
export const addAccessLevelSuccess = (data) => ({ type: ADD_ACCESS_LEVEL_SUCCESS, payload: data });
export const addAccessLevelFailure = (error) => ({ type: ADD_ACCESS_LEVEL_FAILURE, payload: error });

// ========================
// CONFIG / HELPERS
// ========================
const BASE_API = process.env.REACT_APP_BASE_URL;


// ========================
// THUNKS (async actions) - UPDATED TO USE apiWithCompany
// ========================

// Fetch users -> GET: /api/users
export const fetchUsers = () => async (dispatch) => {
    dispatch(fetchUsersRequest());
    try {
        const resp = await apiWithCompany.get(`${BASE_API}users`);
        dispatch(fetchUsersSuccess(resp.data));
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to fetch users";
        dispatch(fetchUsersFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
    }
};

// Create user -> POST: /api/users
export const createUser = (dto) => async (dispatch) => {
    dispatch(createUserRequest());
    try {
        const resp = await apiWithCompany.post(`${BASE_API}users`, dto);
        dispatch(createUserSuccess(resp.data));
        NotificationManager.success("User created successfully");
        dispatch(fetchUsers());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to create user";
        dispatch(createUserFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        throw err;
    }
};

// Update user -> PUT: /api/users/{id}
export const updateUser = (dto) => async (dispatch) => {
    dispatch(updateUserRequest());
    try {
        const id = dto?.UserId ?? dto?.userId ?? dto?.Id ?? dto?.id;

        if (!id) {
            const msg = "updateUser requires UserId in DTO";
            dispatch(updateUserFailure(msg));
            NotificationManager.error(msg);
            throw new Error(msg);
        }

        const url = `${BASE_API}users/${id}`;

        console.debug('[userActions] updateUser -> PUT', url, dto);

        const resp = await apiWithCompany.put(url, dto);

        dispatch(updateUserSuccess(resp.data));
        NotificationManager.success("User updated successfully");
        dispatch(fetchUsers());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to update user";
        dispatch(updateUserFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        console.error('[userActions] updateUser error:', err?.response ?? err);
        throw err;
    }
};

// Inactivate user -> PATCH: /api/users/{id}/inactivate
export const inactivateUser = (id) => async (dispatch) => {
    dispatch(inactivateUserRequest());
    try {
        const resp = await apiWithCompany.patch(`${BASE_API}users/${id}/inactivate`, null);
        dispatch(inactivateUserSuccess(id));
        NotificationManager.success(resp?.data?.message || "User inactivated");
        dispatch(fetchUsers());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to inactivate user";
        dispatch(inactivateUserFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        throw err;
    }
};

// Activate user -> PATCH: /api/users/{id}/activate
export const activateUser = (id) => async (dispatch) => {
    dispatch(activateUserRequest());
    try {
        const resp = await apiWithCompany.patch(`${BASE_API}users/${id}/activate`, null);
        dispatch(activateUserSuccess(id));
        NotificationManager.success(resp?.data?.message || "User activated");
        dispatch(fetchUsers());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to activate user";
        dispatch(activateUserFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        throw err;
    }
};

// Upload excel -> POST: /api/users/upload-excel
export const uploadUsersExcel = (file) => async (dispatch) => {
    dispatch(uploadUsersRequest());
    try {
        const formData = new FormData();
        formData.append("file", file);

        const resp = await apiWithCompany.post(`${BASE_API}users/upload-excel`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch(updateUploadProgress(progress));
            },
        });

        dispatch(uploadUsersSuccess(resp.data));
        NotificationManager.success("Users uploaded successfully");
        dispatch(fetchUsers());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to upload users file";
        dispatch(uploadUsersFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        throw err;
    }
};

// Metadata: business units & access levels

// GET: /api/metadata/businessunits
export const fetchBusinessUnits = () => async (dispatch) => {
    dispatch(fetchBusinessUnitsRequest());
    try {
        const resp = await apiWithCompany.get(`${BASE_API}metadata/businessunits`);
        dispatch(fetchBusinessUnitsSuccess(resp.data));
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to load business units";
        dispatch(fetchBusinessUnitsFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
    }
};

// POST: /api/metadata/businessunits
export const addBusinessUnit = (model) => async (dispatch) => {
    dispatch(addBusinessUnitRequest());
    try {
        const resp = await apiWithCompany.post(`${BASE_API}metadata/businessunits`, model);
        dispatch(addBusinessUnitSuccess(resp.data));
        NotificationManager.success("Business unit added");
        dispatch(fetchBusinessUnits());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to add business unit";
        dispatch(addBusinessUnitFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        throw err;
    }
};

// GET: /api/metadata/accesslevels
export const fetchAccessLevels = () => async (dispatch) => {
    dispatch(fetchAccessLevelsRequest());
    try {
        const resp = await apiWithCompany.get(`${BASE_API}metadata/accesslevels`);
        dispatch(fetchAccessLevelsSuccess(resp.data));
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to load access levels";
        dispatch(fetchAccessLevelsFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
    }
};

// POST: /api/metadata/accesslevels
export const addAccessLevel = (model) => async (dispatch) => {
    dispatch(addAccessLevelRequest());
    try {
        const resp = await apiWithCompany.post(`${BASE_API}metadata/accesslevels`, model);
        dispatch(addAccessLevelSuccess(resp.data));
        NotificationManager.success("Access level added");
        dispatch(fetchAccessLevels());
        return resp.data;
    } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to add access level";
        dispatch(addAccessLevelFailure(msg));
        
        // Don't show notification for multiple assignment errors
        if (!msg.includes('multiple subcompany assignments')) {
            NotificationManager.error(msg);
        }
        throw err;
    }
};

// ========================
// INITIAL STATE
// ========================
const initialState = {
    loading: false,
    users: [],
    error: null,

    uploading: false,
    uploadProgress: 0,
    uploadError: null,

    businessUnits: [],
    accessLevels: [],
};

// ========================
// REDUCER (unchanged)
// ========================
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload };
        case FETCH_USERS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case CREATE_USER_REQUEST:
        case UPDATE_USER_REQUEST:
        case ACTIVATE_USER_REQUEST:
        case INACTIVATE_USER_REQUEST:
            return { ...state, loading: true };

        case CREATE_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
        case ACTIVATE_USER_SUCCESS:
        case INACTIVATE_USER_SUCCESS:
            return { ...state, loading: false };

        case CREATE_USER_FAILURE:
        case UPDATE_USER_FAILURE:
        case ACTIVATE_USER_FAILURE:
        case INACTIVATE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case UPLOAD_USERS_REQUEST:
            return { ...state, uploading: true, uploadError: null, uploadProgress: 0 };
        case UPLOAD_USERS_SUCCESS:
            return { ...state, uploading: false, uploadProgress: 100 };
        case UPLOAD_USERS_FAILURE:
            return { ...state, uploading: false, uploadError: action.payload };
        case UPDATE_UPLOAD_PROGRESS:
            return { ...state, uploadProgress: action.payload };

        case FETCH_BUSINESS_UNITS_REQUEST:
            return { ...state, loading: true };
        case FETCH_BUSINESS_UNITS_SUCCESS:
            return { ...state, loading: false, businessUnits: action.payload };
        case FETCH_BUSINESS_UNITS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case FETCH_ACCESS_LEVELS_REQUEST:
            return { ...state, loading: true };
        case FETCH_ACCESS_LEVELS_SUCCESS:
            return { ...state, loading: false, accessLevels: action.payload };
        case FETCH_ACCESS_LEVELS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case ADD_BUSINESS_UNIT_SUCCESS:
        case ADD_ACCESS_LEVEL_SUCCESS:
            return { ...state };

        default:
            return state;
    }
}