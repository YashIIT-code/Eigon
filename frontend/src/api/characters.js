import client from './client';

export const charactersApi = {
  create: async (data) => {
    const response = await client.post('/characters', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await client.get('/characters');
    return response.data;
  },
  
  getOne: async (id) => {
    const response = await client.get(`/characters/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await client.put(`/characters/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/characters/${id}`);
    return response.data;
  }
};
