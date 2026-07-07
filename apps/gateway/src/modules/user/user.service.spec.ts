import { UserService } from './user.service';

describe('UserService', () => {
  it('forwards Prisma args including include/select to findFirst', async () => {
    const findFirst = jest.fn().mockResolvedValue({ id: 'user-1' });
    const service = new UserService({
      user: { findFirst },
    } as any);

    await service.findOne({
      where: { id: 'user-1' },
      include: { accounts: true },
    });

    expect(findFirst).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      include: { account: true },
    });
  });
});
