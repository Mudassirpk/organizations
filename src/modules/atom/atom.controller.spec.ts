import { Test, TestingModule } from '@nestjs/testing';
import { AtomController } from './atom.controller';
import { AtomService } from './atom.service';

describe('AtomController', () => {
  let controller: AtomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtomController],
      providers: [AtomService],
    }).compile();

    controller = module.get<AtomController>(AtomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
