import { Injectable } from '@nestjs/common';

import { OTPSession } from '@/modules/auth/domain/entities';
import { OTPRepository } from '@/modules/auth/domain/repositories';

@Injectable()
export class InMemoryOTPRepository implements OTPRepository {
  private sessions: Map<string, OTPSession> = new Map();

  async save(session: OTPSession): Promise<OTPSession> {
    this.sessions.set(session.id, session);
    return session;
  }

  async findByIdentifier(identifier: string): Promise<OTPSession | null> {
    const sessions = Array.from(this.sessions.values())
      .filter((s) => s.getIdentifier() === identifier)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return sessions[0] || null;
  }

  async findLatestByIdentifier(identifier: string): Promise<OTPSession | null> {
    const sessions = Array.from(this.sessions.values())
      .filter((s) => s.getIdentifier() === identifier && !s.isExpired())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return sessions[0] || null;
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}
