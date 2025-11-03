// companyActions.js - Updated with apiHelpers
import { NotificationManager } from "react-notifications";
import { apiWithCompany, apiRequest } from 'Api/apiHelpers';

// =======================
// ACTION TYPES
// =======================
const ONBOARD_COMPANY_REQUEST = "ONBOARD_COMPANY_REQUEST";
const ONBOARD_COMPANY_SUCCESS = "ONBOARD_COMPANY_SUCCESS";
const ONBOARD_COMPANY_FAILURE = "ONBOARD_COMPANY_FAILURE";

const FETCH_COMPANY_REQUEST = "FETCH_COMPANY_REQUEST";
const FETCH_COMPANY_SUCCESS = "FETCH_COMPANY_SUCCESS";
const FETCH_COMPANY_FAILURE = "FETCH_COMPANY_FAILURE";

const UPDATE_COMPANY_REQUEST = "UPDATE_COMPANY_REQUEST";
const UPDATE_COMPANY_SUCCESS = "UPDATE_COMPANY_SUCCESS";
const UPDATE_COMPANY_FAILURE = "UPDATE_COMPANY_FAILURE";

// =======================
// ACTION CREATORS
// =======================
export const onboardCompanyRequest = () => ({ type: ONBOARD_COMPANY_REQUEST });
export const onboardCompanySuccess = (data) => ({ type: ONBOARD_COMPANY_SUCCESS, payload: data });
export const onboardCompanyFailure = (error) => ({ type: ONBOARD_COMPANY_FAILURE, payload: error });

export const fetchCompanyRequest = () => ({ type: FETCH_COMPANY_REQUEST });
export const fetchCompanySuccess = (data) => ({ type: FETCH_COMPANY_SUCCESS, payload: data });
export const fetchCompanyFailure = (error) => ({ type: FETCH_COMPANY_FAILURE, payload: error });

export const updateCompanyRequest = () => ({ type: UPDATE_COMPANY_REQUEST });
export const updateCompanySuccess = (data) => ({ type: UPDATE_COMPANY_SUCCESS, payload: data });
export const updateCompanyFailure = (error) => ({ type: UPDATE_COMPANY_FAILURE, payload: error });

// =======================
// API BASE URL
// =======================
const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}Company`;

// =======================
// THUNKS (UPDATED)
// =======================

// 1️⃣ Onboard a New Company (No auth required)
export const onboardCompany = (payload) => async (dispatch) => {
  dispatch(onboardCompanyRequest());
  try {
    // Use direct axios for onboarding (no auth token needed)
    const response = await apiRequest('post', `${API_BASE_URL}/onboard`, payload);
    dispatch(onboardCompanySuccess(response.data));

    const { CompanyId, Message } = response.data;
    if (CompanyId) {
      localStorage.setItem("companyId", CompanyId);
    }

    NotificationManager.success(Message || "Company onboarded successfully!");
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.message ||
      "An unexpected error occurred during onboarding.";

    dispatch(onboardCompanyFailure(message));
    NotificationManager.error(message);
  }
};

// 2️⃣ Get Company Details (Uses apiWithCompany for automatic company selection)
export const fetchCompanyDetails = () => async (dispatch) => {
  dispatch(fetchCompanyRequest());
  try {
    const response = await apiWithCompany.get(`${API_BASE_URL}/effective`);

    console.log("✅ Company data fetched:", response.data);

    dispatch(fetchCompanySuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.response?.data?.message || // Added to catch different error formats
      error.message ||
      "Failed to fetch company details.";

    dispatch(fetchCompanyFailure(message));
    
    // Only show notification for non-authentication errors
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      NotificationManager.error(message);
    }
  }
};

// 3️⃣ Update Company Details (Uses apiWithCompany for automatic company selection)
export const updateCompanyDetails = (updatedData) => async (dispatch) => {
  dispatch(updateCompanyRequest());
  try {
    const response = await apiWithCompany.put(`${API_BASE_URL}/effective`, updatedData);
    dispatch(updateCompanySuccess(response.data));

    NotificationManager.success(
      response.data?.Message || "Company updated successfully!"
    );
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred while updating the company.";

    dispatch(updateCompanyFailure(message));
    
    // Only show notification for non-authentication errors
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      NotificationManager.error(message);
    }
  }
};

// =======================
// NEW ACTIONS FOR SUB-COMPANIES
// =======================

// Action Types for Sub Companies
const FETCH_SUB_COMPANIES_REQUEST = "FETCH_SUB_COMPANIES_REQUEST";
const FETCH_SUB_COMPANIES_SUCCESS = "FETCH_SUB_COMPANIES_SUCCESS";
const FETCH_SUB_COMPANIES_FAILURE = "FETCH_SUB_COMPANIES_FAILURE";

const CREATE_SUB_COMPANY_REQUEST = "CREATE_SUB_COMPANY_REQUEST";
const CREATE_SUB_COMPANY_SUCCESS = "CREATE_SUB_COMPANY_SUCCESS";
const CREATE_SUB_COMPANY_FAILURE = "CREATE_SUB_COMPANY_FAILURE";

const ASSIGN_SUPERUSERS_REQUEST = "ASSIGN_SUPERUSERS_REQUEST";
const ASSIGN_SUPERUSERS_SUCCESS = "ASSIGN_SUPERUSERS_SUCCESS";
const ASSIGN_SUPERUSERS_FAILURE = "ASSIGN_SUPERUSERS_FAILURE";

// Action Creators for Sub Companies
export const fetchSubCompaniesRequest = () => ({ type: FETCH_SUB_COMPANIES_REQUEST });
export const fetchSubCompaniesSuccess = (data) => ({ type: FETCH_SUB_COMPANIES_SUCCESS, payload: data });
export const fetchSubCompaniesFailure = (error) => ({ type: FETCH_SUB_COMPANIES_FAILURE, payload: error });

export const createSubCompanyRequest = () => ({ type: CREATE_SUB_COMPANY_REQUEST });
export const createSubCompanySuccess = (data) => ({ type: CREATE_SUB_COMPANY_SUCCESS, payload: data });
export const createSubCompanyFailure = (error) => ({ type: CREATE_SUB_COMPANY_FAILURE, payload: error });

export const assignSuperUsersRequest = () => ({ type: ASSIGN_SUPERUSERS_REQUEST });
export const assignSuperUsersSuccess = (data) => ({ type: ASSIGN_SUPERUSERS_SUCCESS, payload: data });
export const assignSuperUsersFailure = (error) => ({ type: ASSIGN_SUPERUSERS_FAILURE, payload: error });

// Thunks for Sub Companies

// Fetch all sub-companies for the parent company
export const fetchSubCompanies = () => async (dispatch) => {
  dispatch(fetchSubCompaniesRequest());
  try {
    const parentCompanyId = localStorage.getItem("companyId");
    if (!parentCompanyId) {
      throw new Error("Parent company ID not found");
    }

    const response = await apiWithCompany.get(`${API_BASE_URL}/${parentCompanyId}/subcompanies`);
    dispatch(fetchSubCompaniesSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch sub-companies.";

    dispatch(fetchSubCompaniesFailure(message));
    NotificationManager.error(message);
  }
};

// Create a new sub-company
export const createSubCompany = (subCompanyData) => async (dispatch) => {
  dispatch(createSubCompanyRequest());
  try {
    const parentCompanyId = localStorage.getItem("companyId");
    if (!parentCompanyId) {
      throw new Error("Parent company ID not found");
    }

    const response = await apiWithCompany.post(
      `${API_BASE_URL}/${parentCompanyId}/subcompanies`,
      subCompanyData
    );
    
    dispatch(createSubCompanySuccess(response.data));
    NotificationManager.success("Sub-company created successfully!");
    
    // Refresh the sub-companies list
    dispatch(fetchSubCompanies());
    
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to create sub-company.";

    dispatch(createSubCompanyFailure(message));
    NotificationManager.error(message);
    throw error; // Re-throw to handle in component
  }
};

// Assign superusers to a sub-company
export const assignSuperUsersToSubCompany = (subCompanyId, userIds) => async (dispatch) => {
  dispatch(assignSuperUsersRequest());
  try {
    const parentCompanyId = localStorage.getItem("companyId");
    if (!parentCompanyId) {
      throw new Error("Parent company ID not found");
    }

    const response = await apiWithCompany.post(
      `${API_BASE_URL}/${parentCompanyId}/subcompanies/${subCompanyId}/assign-superusers`,
      { userIds }
    );
    
    dispatch(assignSuperUsersSuccess(response.data));
    NotificationManager.success("Superusers assigned successfully!");
    
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to assign superusers.";

    dispatch(assignSuperUsersFailure(message));
    NotificationManager.error(message);
    throw error; // Re-throw to handle in component
  }
};

// Fetch parent company superusers (for dropdown)
export const fetchParentSuperUsers = () => async (dispatch) => {
  try {
    const parentCompanyId = localStorage.getItem("companyId");
    if (!parentCompanyId) {
      throw new Error("Parent company ID not found");
    }

    const response = await apiWithCompany.get(`${API_BASE_URL}/${parentCompanyId}/superusers`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch superusers.";
    
    NotificationManager.error(message);
    throw error;
  }
};

// =======================
// UPDATED REDUCER WITH SUB-COMPANIES
// =======================
const initialState = {
  loading: false,
  company: null,
  error: null,
  onboarding: false,
  updating: false,
  subCompanies: {
    list: [],
    loading: false,
    error: null
  }
};

export default function companyReducer(state = initialState, action) {
  switch (action.type) {
    // --- Onboard ---
    case ONBOARD_COMPANY_REQUEST:
      return { ...state, onboarding: true, error: null };
    case ONBOARD_COMPANY_SUCCESS:
      return { ...state, onboarding: false, company: action.payload };
    case ONBOARD_COMPANY_FAILURE:
      return { ...state, onboarding: false, error: action.payload };

    // --- Fetch Company ---
    case FETCH_COMPANY_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_COMPANY_SUCCESS:
      return { ...state, loading: false, company: action.payload };
    case FETCH_COMPANY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // --- Update Company ---
    case UPDATE_COMPANY_REQUEST:
      return { ...state, updating: true, error: null };
    case UPDATE_COMPANY_SUCCESS:
      return {
        ...state,
        updating: false,
        company: action.payload.Company || action.payload,
      };
    case UPDATE_COMPANY_FAILURE:
      return { ...state, updating: false, error: action.payload };

    // --- Sub Companies ---
    case FETCH_SUB_COMPANIES_REQUEST:
      return { 
        ...state, 
        subCompanies: { ...state.subCompanies, loading: true, error: null } 
      };
    case FETCH_SUB_COMPANIES_SUCCESS:
      return { 
        ...state, 
        subCompanies: { ...state.subCompanies, loading: false, list: action.payload } 
      };
    case FETCH_SUB_COMPANIES_FAILURE:
      return { 
        ...state, 
        subCompanies: { ...state.subCompanies, loading: false, error: action.payload } 
      };

    // --- Create Sub Company ---
    case CREATE_SUB_COMPANY_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_SUB_COMPANY_SUCCESS:
      return { ...state, loading: false };
    case CREATE_SUB_COMPANY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // --- Assign Super Users ---
    case ASSIGN_SUPERUSERS_REQUEST:
      return { ...state, loading: true, error: null };
    case ASSIGN_SUPERUSERS_SUCCESS:
      return { ...state, loading: false };
    case ASSIGN_SUPERUSERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}