export const USER_CACHE_TTL = 1000 * 60 * 60 * 5
export const SCHOOL_USER_CACHE_TTL = 1000 * 60 * 60 * 5
export const schoolUserCacheKey = ({userId, schoolId}: {userId: string, schoolId: string}) => {
    return `school_user:${schoolId}:${userId}` as const;
}
