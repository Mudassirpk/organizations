export class CreateResourceDTO {
  name: string;
  organizationId: number;
  attributes: TAttribute[];
}

export type TAttribute = {
  name: string;
  value: string;
};
