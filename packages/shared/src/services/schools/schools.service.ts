import api from '../../lib/api';

export const schoolService = {
  searchSchools: async (search: string | null) => {
    const res = await api.get('/schools/search', {
      params: { search },
    });
    return res.data;
  },

  getClasses: async (schoolId: string) => {
    const res = await api.get(`/schools/${schoolId}/classes`);
    return res.data;
  },
};
