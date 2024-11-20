import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AtomService } from './atom.service';

@Controller('atom')
export class AtomController {
  constructor(private readonly atomService: AtomService) {}

  @Delete(':atomId')
  delete(@Param('atomId') atomId: string) {
    return this.atomService.delete({ atomId: +atomId });
  }

  @Get(':atomId')
  one(@Param('atomId') atomId: string) {
    return this.atomService.one(+atomId);
  }
}
