import { TAttribute } from './create-resource.dto';

export class UpdateResourceDTO {
  // TODO: later add auth attirbutes
  resourceId: number;
  attributes: (TAttribute & { id: number })[];
}
