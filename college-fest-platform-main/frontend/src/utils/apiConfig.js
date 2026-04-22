const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const normalizeApiBaseUrl = (value) => {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return DEFAULT_API_BASE_URL;
  }

  try {
    const parsedUrl = new URL(rawValue);
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, '');
    parsedUrl.pathname = normalizedPath && normalizedPath !== '/' ? normalizedPath : '/api';

    return parsedUrl.toString().replace(/\/+$/, '');
  } catch (error) {
    const normalizedRawValue = rawValue.replace(/\/+$/, '');
    return normalizedRawValue || DEFAULT_API_BASE_URL;
  }
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.REACT_APP_API_URL);

export const apiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default API_BASE_URL;
