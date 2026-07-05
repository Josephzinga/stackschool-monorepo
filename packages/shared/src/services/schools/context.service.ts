import { api } from '../../lib/api.js';

export const contextService = {
  parentContext: async () => {
    const res = await api.get('/complete-profile/parent/context');
    return res.data;
  },
  studentContext: async () => {
    const res = await api.get('/complete-profile/student/context');
    return res.data;
  },
};
