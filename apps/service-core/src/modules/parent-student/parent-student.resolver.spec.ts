import { Test, TestingModule } from '@nestjs/testing';
import { ParentStudentResolver } from './parent-student.resolver';
import { ParentStudentService } from './parent-student.service';

describe('ParentStudentResolver', () => {
  let resolver: ParentStudentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentStudentResolver, ParentStudentService],
    }).compile();

    resolver = module.get<ParentStudentResolver>(ParentStudentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
