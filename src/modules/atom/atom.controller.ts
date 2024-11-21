import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AtomService } from './atom.service';
import { UpdateAtomDTO } from '../resource/dto/update-atom.dto';

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

  @Put(':atomId')
  update(@Param('atomId') atomId: string, @Body() body: UpdateAtomDTO) {
    return this.atomService.update(+atomId, body);
  }

  @Post('many-by-ids')
  getManyByIds(@Body() body: { ids: string[] }) {
    return this.atomService.manyByIds(body.ids.map((id) => +id));
  }
}
