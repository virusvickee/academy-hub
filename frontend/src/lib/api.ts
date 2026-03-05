const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token') || '';

const handleResponse = async (response) => {
  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
  
  // Non-JSON response
  const text = await response.text();
  if (!response.ok) throw new Error(text || 'Request failed');
  return text;
};

export const authAPI = {
  register: async (name, email, password, role) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  }
};

export const pdfAPI = {
  upload: async (formData) => {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/pdfs/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleResponse(response);
  },

  getMyPdfs: async () => {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/pdfs/my-pdfs`, {
      headers
    });
    return handleResponse(response);
  },

  search: async (params) => {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/pdfs/search?${query}`, {
      headers
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/pdfs/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/pdfs/${id}`, {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  }
};
