const SCHOOL_PATTERNS = {
  CREATE: 'core.lists.create',
  FIND_ONE: 'core.lists.find_one',
  FIND_MANY: 'core.lists.find_many',
  SEARCH: 'core.lists.search',
} as const;
const COMPLETE_PROFILE_PATTERNS = {
  HANDLE_SCHOOL_DATA: 'auth.complete_profile.handle_school_data',
  HANDLE_ROLE_DATA: 'auth.complete_profile.handle_role_data',
} as const;

const MEMBERSHIP_PATTERNS = {
  FIND_ONE: 'core.membership.find_one',
  FIND_MANY: 'core.membership.find_many',
  FIND_MANY_BY_USER_ID: 'core.membership.find_many_by_user_id',
  FIND_BY_SCHOOL_ID_AND_USER_ID:
    'core.membership.find_by_school_id_and_user_id',
} as const;

const TEACHER_PATTERNS = {
  FIND_PAGINATED: 'core.teacher.find_paginated',
} as const;

export const CORE_PATTERNS = {
  SCHOOL: SCHOOL_PATTERNS,
  MEMBERSHIP: MEMBERSHIP_PATTERNS,
  COMPLETE_PROFILE: COMPLETE_PROFILE_PATTERNS,
  TEACHER: TEACHER_PATTERNS,
} as const;
