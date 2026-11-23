// Default address of the local FastAPI server. No .env file is required.
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error('Cannot connect to the backend. Is FastAPI running on port 8000?');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : 'Something went wrong. Please try again.');
  }
  return data;
}

export function imageUrl(path) {
  return `${API_URL}${path}`;
}

export const getStatus = () => request('/status');
export const getHistory = () => request('/history');
export const getScan = (id) => request(`/history/${encodeURIComponent(id)}`);
export const deleteScan = (id) => request(`/history/${encodeURIComponent(id)}`, { method: 'DELETE' });

export function predictImage(file) {
  const body = new FormData();
  body.append('file', file);
  // Do NOT manually set Content-Type; the browser adds the multipart boundary.
  return request('/predict', { method: 'POST', body });
}
