'use client';
import { api } from '@stackschool/contracts';
import { useUserStore } from '@stackschool/ui';

export function registerSchoolHeaderInterceptor(id?: string) {
  api.interceptors.request.use((config) => {
    const schoolId = useUserStore.getState().currentSchool?.id;
    if (schoolId) {
      config.headers = config.headers ?? {};
      config.headers['x-school-id'] = schoolId || id;
    }
    return config;
  });
}
