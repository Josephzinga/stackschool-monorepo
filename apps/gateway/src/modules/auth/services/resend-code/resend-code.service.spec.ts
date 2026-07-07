import { Test, TestingModule } from '@nestjs/testing';
import { ResendCodeService } from './resend-code.service';

describe('ResendCodeService', () => {
  let service: ResendCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResendCodeService],
    }).compile();

    service = module.get<ResendCodeService>(ResendCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
