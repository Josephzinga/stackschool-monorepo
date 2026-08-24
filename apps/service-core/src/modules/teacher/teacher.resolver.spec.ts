import { Test, TestingModule } from '@nestjs/testing';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';

describe('TeacherResolver', () => {
  let resolver: TeacherResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherResolver, TeacherService],
    }).compile();

    resolver = module.get<TeacherResolver>(TeacherResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
