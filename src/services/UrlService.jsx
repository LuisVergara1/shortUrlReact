import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/url',
});

export function getShortCode(value) {
  const input = value.trim();
  if (/^[a-zA-Z0-9]{1,255}$/.test(input)) return input;

  try {
    const url = new URL(input);
    if (['http:', 'https:'].includes(url.protocol)) {
      return url.pathname.match(/^\/r\/([a-zA-Z0-9]{1,255})\/?$/)?.[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

export function storedManagementKey(code) {
  try {
    return localStorage.getItem(`linkslice:key:${code}`) || '';
  } catch {
    return '';
  }
}

export async function createLink({ urlOriginal, shortUrl, alias, managementKey }) {
  const response = await api.post(shortUrl ? '/createfull' : '/create', {
    urlOriginal, shortUrl, alias, managementKey,
  });
  const key = response.headers['x-management-key'];
  let keySaved = false;
  if (key) {
    const code = getShortCode(response.data);
    try {
      if (code) {
        localStorage.setItem(`linkslice:key:${code}`, key);
        keySaved = true;
      }
    } catch {
      // The creation form still offers the key when local storage is unavailable.
    }
  }
  return { url: response.data, key, keySaved };
}

export function extendUrl(code, managementKey) {
  return api.put('/extend', { urlOriginal: code, managementKey });
}

export async function deleteUrl(code, managementKey) {
  const response = await api.delete('/delete', { data: { urlOriginal: code, managementKey } });
  try {
    localStorage.removeItem(`linkslice:key:${code}`);
  } catch {
    // The link has already been deleted.
  }
  return response;
}

export async function getLinkConfig(signal) {
  const { data } = await api.get('/config', { signal });
  return data;
}

export async function getLinkStats(code) {
  const { data } = await api.get(`/${encodeURIComponent(code)}/stats`);
  return data;
}

export async function getAliasStats(alias, page) {
  const { data } = await api.get('/stats/by-alias', { params: { alias, page, size: 5 } });
  return data;
}

export function requestMessage(error, fallback) {
  const message = error.response?.data;
  return typeof message === 'string' && message ? message : fallback;
}
