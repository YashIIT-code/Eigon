import client from './client';

export const projectsApi = {
  create: async (data) => {
    const response = await client.post('/jobs', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await client.get('/jobs');
    return response.data;
  },
  
  getOne: async (id) => {
    const response = await client.get(`/jobs/${id}`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await client.delete(`/jobs/${id}`);
    return response.data;
  },

  getVideos: async () => {
    const response = await client.get('/videos');
    return response.data;
  }
};
