import client from './client';

export const authApi = {
  login: async (credentials) => {
    const { data } = await client.post('/auth/login', credentials);
    return data;
  },
  
  signup: async (userData) => {
    const { data } = await client.post('/auth/signup', userData);
    return data;
  },
  
  getMe: async () => {
    const { data } = await client.get('/auth/me');
    return data;
  }
};
