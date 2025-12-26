import api from '../../lib/api';
import type { AxiosInstance } from 'axios';

export class RedisService {
  constructor(private readonly client: AxiosInstance = api) {}

  async saveProgressToRedis(data: any): Promise<any> {
    const res = await this.client.post('/complete-profile/save-progress', data);
    return res.data;
  }

  async loadFromRedis(): Promise<any> {
    const res = await this.client.get('/complete-profile/load-progress');
    return res.data;
  }

  async clearAllData(): Promise<void> {
    await this.client.delete('/complete-profile/clear-progress');
  }
}

export const redisService = new RedisService();
