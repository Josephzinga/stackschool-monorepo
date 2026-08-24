import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './db/generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /*// Helper pour les transactions
  async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction<T>(fn);
  }
*/
  /* // Helper pour la pagination
  async paginate<T>(
    model: any,
    args: any,
    page: number = 0,
    limit: number = 10,
  ): Promise<{ data: T[]; total: number }> {
    const [data, total] = await Promise.all([
      model.findMany({
        ...args,
        skip: page * limit,
        take: limit,
      }),
      model.count({ where: args.where }),
    ]);
    return { data, total };
  }
  */
}
