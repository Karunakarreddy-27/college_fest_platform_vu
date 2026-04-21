const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export const apiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default API_BASE_URL;
