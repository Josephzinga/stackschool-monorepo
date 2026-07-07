import { Test, TestingModule } from '@nestjs/testing';
import { CompleteProfileResolver } from './complete-profile.resolver';
import { CompleteProfileService } from './complete-profile.service';

describe('CompleteProfileResolver', () => {
  let resolver: CompleteProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteProfileResolver, CompleteProfileService],
    }).compile();

    resolver = module.get<CompleteProfileResolver>(CompleteProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
