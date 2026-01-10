import api from '../../lib/api';
import { SEARCH_SCHOOL_GQL } from '../../graphql/graphql-query';

export const schoolService = {
  searchSchools: async (searchTerm: string | null) => {
    const res = await api.post('/graphql', {
      query: SEARCH_SCHOOL_GQL,
      variables: {
        input: {
          searchTerm,
        },
      },
    });
    return res.data;
  },

  getClasses: async (schoolId: string) => {
    const res = await api.get(`/schools/${schoolId}/classes`);
    return res.data;
  },
};
