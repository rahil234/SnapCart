import { GetMeResult } from '@/modules/user/application/queries/get-me/get-me.result';

export interface MeReadRepository {
  getMeByUserId(userId: string): Promise<GetMeResult>;
}
