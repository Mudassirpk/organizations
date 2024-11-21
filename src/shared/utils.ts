import * as crypto from 'crypto';
import { attribute } from '@prisma/client';

export function randomString(length: number) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

export function setAtomData(
  relationNames: string[],
  relations: attribute[],
  value: { name: string; value: any },
) {
  const data = {};

  if (
    relationNames.includes(value.name) &&
    relations.find((r) => r.name === value.name).relationType === 'OTM'
  ) {
    // handle addition OTM relation field
    if (
      typeof value.value === 'string' &&
      value.value.toLowerCase().trim() === 'all'
    ) {
      // if all atoms where selected for relation
      data[value.name] = value.value;
    } else if (
      typeof value.value === 'object' &&
      Array.isArray(value.value as any)
    ) {
      // if only specific atoms where selected for relation
      data[value.name] = value.value;
    }
  } else {
    data[value.name] = value.value;
  }

  return data;
}
