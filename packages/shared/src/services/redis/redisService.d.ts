import type { AxiosInstance } from 'axios';
export declare class RedisService {
    private readonly client;
    constructor(client?: AxiosInstance);
    saveProgressToRedis(data: any): Promise<any>;
    loadFromRedis(): Promise<any>;
    clearAllData(): Promise<void>;
}
export declare const redisService: RedisService;
//# sourceMappingURL=redisService.d.ts.map