import api from '../../lib/api';

export const schoolService = {
  searchSchools: async (search: string | null) => {
    const res = await api.get('/schools', {
      params: { search },
    });
    return res.data;
  },
};
