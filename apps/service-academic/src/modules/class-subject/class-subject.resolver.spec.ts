import { Test, TestingModule } from '@nestjs/testing';
import { ClassSubjectResolver } from './class-subject.resolver';
import { ClassSubjectService } from './class-subject.service';

describe('ClassSubjectResolver', () => {
  let resolver: ClassSubjectResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassSubjectResolver, ClassSubjectService],
    }).compile();

    resolver = module.get<ClassSubjectResolver>(ClassSubjectResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
