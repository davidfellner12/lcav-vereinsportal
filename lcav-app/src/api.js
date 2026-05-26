const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

function getToken() { return localStorage.getItem('lcav_token'); }

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),

  // Auth
  login:      (email, password) => request('POST', '/auth/login', { email, password }),
  me:         ()                 => request('GET',  '/auth/me'),
  changePass: (cur, next)        => request('PUT',  '/auth/password', { currentPassword: cur, newPassword: next }),

  // Users
  getUsers:   ()     => request('GET',  '/users'),
  createUser: (data) => request('POST', '/users', data),
  updateUser: (id, data) => request('PUT', `/users/${id}`, data),

  // Groups
  getGroups:        ()           => request('GET',  '/groups'),
  getGroupMembers:  (name)       => request('GET',  `/groups/${name}/members`),
  addGroupMember:   (name, data) => request('POST', `/groups/${name}/members`, data),
  removeGroupMember:(name, uid)  => request('DELETE',`/groups/${name}/members/${uid}`),

  // Channels & messages
  getChannels:  ()          => request('GET',  '/channels'),
  getMessages:  (channelId) => request('GET',  `/channels/${channelId}/messages?limit=100`),
  sendMessage:  (channelId, text) => request('POST', `/channels/${channelId}/messages`, { text }),

  // Training
  getPlans:     (params = {}) => request('GET', `/training?${new URLSearchParams(params)}`),
  getPlan:      (id)          => request('GET', `/training/${id}`),
  createPlan:   (data)        => request('POST', '/training', data),
  updatePlan:   (id, data)    => request('PUT', `/training/${id}`, data),
  deletePlan:   (id)          => request('DELETE', `/training/${id}`),
  addUnit:      (planId, data) => request('POST', `/training/${planId}/units`, data),
  updateUnit:   (unitId, data) => request('PUT',  `/training/units/${unitId}`, data),
  deleteUnit:   (unitId)       => request('DELETE',`/training/units/${unitId}`),

  // Events
  getEvents:      (params = {}) => request('GET', `/events?${new URLSearchParams(params)}`),
  getEvent:       (id)          => request('GET', `/events/${id}`),
  createEvent:    (data)        => request('POST', '/events', data),
  updateEvent:    (id, data)    => request('PUT',  `/events/${id}`, data),
  signUpHelper:   (id)          => request('POST', `/events/${id}/helpers`, {}),
  unSignHelper:   (id)          => request('DELETE',`/events/${id}/helpers`),

  // Tasks
  getTasks:   (params = {}) => request('GET', `/tasks?${new URLSearchParams(params)}`),
  createTask: (data)        => request('POST', '/tasks', data),
  updateTask: (id, data)    => request('PUT',  `/tasks/${id}`, data),
  deleteTask: (id)          => request('DELETE',`/tasks/${id}`),

  // Results
  getResults:    (params = {}) => request('GET', `/results?${new URLSearchParams(params)}`),
  getBestenliste:(discipline)  => request('GET', `/results/bestenliste${discipline ? '?discipline='+discipline : ''}`),
  addResult:     (data)        => request('POST', '/results', data),

  // Registrations
  getRegistrations: (params = {}) => request('GET', `/registrations?${new URLSearchParams(params)}`),
  register:         (data)         => request('POST', '/registrations', data),
};

export function saveToken(t) { localStorage.setItem('lcav_token', t); }
export function clearToken()  { localStorage.removeItem('lcav_token'); }
