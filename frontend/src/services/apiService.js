import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

export const uploadToIPFS = async (file, encryptionKey) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('encryptionKey', encryptionKey);
  
  const response = await api.post('/ipfs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const fetchRecord = async (cid, encryptionKey) => {
  const response = await api.get(`/ipfs/fetch/${cid}`, {
    params: { key: encryptionKey }
  });
  return response.data;
};

export const getAuditLogs = async (patientAddress) => {
  const response = await api.get(`/audit/logs/${patientAddress}`);
  return response.data;
};

export const verifySignature = async (address, message, signature) => {
  const response = await api.post('/auth/verify', {
    address,
    message,
    signature
  });
  return response.data;
};

export const getSystemStatus = async () => {
  const response = await api.get('/system/status');
  return response.data;
};

// Add error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'API request failed');
    } else if (error.request) {
      console.error('API Request Error:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('API Setup Error:', error.message);
      throw new Error('Error setting up API request');
    }
  }
);