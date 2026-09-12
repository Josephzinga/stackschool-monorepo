import { Test, TestingModule } from '@nestjs/testing';
import { ParentStudentService } from './parent-student.service';

describe('ParentStudentService', () => {
  let service: ParentStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentStudentService],
    }).compile();

    service = module.get<ParentStudentService>(ParentStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
