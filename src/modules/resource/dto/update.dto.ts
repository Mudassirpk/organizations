import { TAttribute } from './create-resource.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResourceDTO {
  // TODO: later add auth attributes
  @ApiProperty()
  resourceId: number;
  @ApiProperty()
  attributes: (TAttribute & { id: number })[];
}
