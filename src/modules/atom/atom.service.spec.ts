import { Test, TestingModule } from '@nestjs/testing';
import { AtomService } from './atom.service';

describe('AtomService', () => {
  let service: AtomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtomService],
    }).compile();

    service = module.get<AtomService>(AtomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
