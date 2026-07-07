import { Test, TestingModule } from '@nestjs/testing';
import { CompleteProfileService } from './complete-profile.service';

describe('CompleteProfileService', () => {
  let service: CompleteProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteProfileService],
    }).compile();

    service = module.get<CompleteProfileService>(CompleteProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
