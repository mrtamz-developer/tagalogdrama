const API_BASE = window.TAGALOGDRAMA_API || '';
async function api(path, options={}) {
  const response = await fetch(`${API_BASE}${path}`, {credentials:'include', ...options});
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}
window.AdminAPI = {api};
