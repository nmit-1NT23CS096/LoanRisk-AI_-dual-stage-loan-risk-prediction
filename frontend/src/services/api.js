import axios from 'axios';

// In development: Vite proxy forwards /api → localhost:8000
// In production:  VITE_API_BASE_URL points to the Render backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchDashboardSummary = async (filters = {}) => {
  const response = await axios.get(`${API_BASE}/dashboard/summary`, { params: filters });
  return response.data;
};

export const fetchDashboardAnalytics = async (filters = {}) => {
  const response = await axios.get(`${API_BASE}/dashboard/analytics`, { params: filters });
  return response.data;
};

export const fetchTopRiskLoans = async () => {
  const response = await axios.get(`${API_BASE}/dashboard/top-risk-loans`);
  return response.data;
};

export const predictPreLoan = async (payload) => {
  const response = await axios.post(`${API_BASE}/pre-loan/predict`, payload);
  return response.data;
};

export const predictPostLoan = async (payload) => {
  const response = await axios.post(`${API_BASE}/post-loan/predict`, payload);
  return response.data;
};

export const fetchModelPerformance = async () => {
  const response = await axios.get(`${API_BASE}/model/performance`);
  return response.data;
};

export const fetchDataQuality = async () => {
  const response = await axios.get(`${API_BASE}/data-quality`);
  return response.data;
};
