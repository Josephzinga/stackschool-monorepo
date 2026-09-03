import { Test, TestingModule } from '@nestjs/testing';
import { ParentResolver } from './parent.resolver';
import { ParentService } from './parent.service';

describe('ParentResolver', () => {
  let resolver: ParentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentResolver, ParentService],
    }).compile();

    resolver = module.get<ParentResolver>(ParentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
