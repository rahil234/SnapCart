import { OTPSession } from '@/domain/auth/entities';

export interface OTPRepository {
  save(session: OTPSession): Promise<OTPSession>;
  findByIdentifier(identifier: string): Promise<OTPSession | null>;
  findLatestByIdentifier(identifier: string): Promise<OTPSession | null>;
  delete(id: string): Promise<void>;
}
