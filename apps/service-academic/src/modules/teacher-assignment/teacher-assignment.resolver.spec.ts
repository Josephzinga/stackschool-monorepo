import { Test, TestingModule } from '@nestjs/testing';
import { TeacherAssignmentResolver } from './teacher-assignment.resolver';
import { TeacherAssignmentService } from './teacher-assignment.service';

describe('TeacherAssignmentResolver', () => {
  let resolver: TeacherAssignmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherAssignmentResolver, TeacherAssignmentService],
    }).compile();

    resolver = module.get<TeacherAssignmentResolver>(TeacherAssignmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
