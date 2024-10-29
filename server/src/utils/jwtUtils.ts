import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

const signAccessToken = (payload: object): string => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
  const ACCESS_TOKEN_EXPIRATION = '15m';
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

const signRefreshToken = (payload: object): string => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;
  const REFRESH_TOKEN_EXPIRATION = '7d';
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

const verifyAccessToken = (token: string): JwtPayload | null => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
  return verifyToken(token, ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string): JwtPayload | null => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;
  return verifyToken(token, REFRESH_TOKEN_SECRET);
};

const verifyToken = (token: string, secret: Secret): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};
export default {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyToken,
};
