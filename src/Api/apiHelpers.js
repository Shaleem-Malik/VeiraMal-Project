// apiHelpers.js
import axios from 'axios';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token missing');
  }
  return { Authorization: `Bearer ${token}` };
};

export const getCompanyQueryParams = () => {
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');

  // If user has explicitly selected a company, always include it.
  // This ensures the server can resolve the intended target company
  // even when the selected company is the parent (base) company.
  if (selectedCompanyId) {
    return { subCompanyId: selectedCompanyId };
  }

  return {};
};

export const apiRequest = async (method, url, data = null) => {
  const headers = getAuthHeaders();
  const params = getCompanyQueryParams();

  const config = {
    method,
    url,
    headers,
    params,
    ...(data && { data })
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Enhanced axios instance with automatic company selection
export const apiWithCompany = axios.create();

apiWithCompany.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`
    };
  }

  const selectedCompanyId = localStorage.getItem('selectedCompanyId');

  // Always include selectedCompanyId when present (even if same as base company).
  if (selectedCompanyId) {
    config.params = {
      ...(config.params || {}),
      subCompanyId: selectedCompanyId
    };
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
