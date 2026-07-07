import { Test, TestingModule } from '@nestjs/testing';
import { MembershipResolver } from './membership.resolver';
import { MembershipService } from './membership.service';

describe('MembershipResolver', () => {
  let resolver: MembershipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipResolver, MembershipService],
    }).compile();

    resolver = module.get<MembershipResolver>(MembershipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
