export interface JwtPayload {
  sub: string;
  role: string;
}

export interface JwtAccessTokenPayload extends JwtPayload {}

export interface JwtRefreshTokenPayload extends JwtPayload {}

export interface JwtVerifiedPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
