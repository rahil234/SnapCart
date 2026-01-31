export interface GoogleAuthService {
  verifyIdToken(idToken: string): Promise<{
    email: string;
    name?: string;
    picture?: string;
  }>;
}
