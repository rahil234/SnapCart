import { Prisma } from '@prisma/client';

export class JsonValidatorUtil {
  static toJsonObject(value: unknown): Prisma.InputJsonObject {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Invalid JSON object');
    }

    return value as Prisma.InputJsonObject;
  }

  static toJsonValue(value: unknown): Prisma.InputJsonValue {
    try {
      JSON.stringify(value);
      return value as Prisma.InputJsonValue;
    } catch {
      throw new Error('Invalid JSON value');
    }
  }
}
