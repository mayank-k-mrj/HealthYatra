const BASE_URL = "https://health-yatra.onrender.com";

export const getAuthToken = () => localStorage.getItem("token");

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const extractPicUrl = (picStr) => {
  if (!picStr || typeof picStr !== 'string') return "";
  let clean = picStr.trim();
  
  if (clean.includes('[')) {
    const start = clean.indexOf('[');
    const end = clean.lastIndexOf(']');
    if (start !== -1 && end > start) {
      clean = clean.slice(start + 1, end);
    }
  }
  
  clean = clean.replace(/^["'\s\\]+|["'\s\\]+$/g, '');
  
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  
  return "";
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      console.warn("Unauthorized request or token expired.");
    }

    return response;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error;
  }
};

export default {
  BASE_URL,
  getAuthToken,
  setAuthToken,
  extractPicUrl,
  apiRequest,
};
