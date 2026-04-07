import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error('JWT_SECRET manquant ou trop court (minimum 32 caracteres).');
  }
  return secret;
}

const LEGACY_USER_ID_MAP: Record<string, string> = {
  cmnd2zl6800001437px42dhqn: 'cmmxevjwa0000e0906v9i2fki',
};

function normalizeAuthPayload(payload: any) {
  if (!payload || typeof payload !== 'object') return payload;
  if (typeof payload.userId === 'string' && LEGACY_USER_ID_MAP[payload.userId]) {
    return {
      ...payload,
      userId: LEGACY_USER_ID_MAP[payload.userId],
    };
  }
  return payload;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: '24h' });
};

export interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const payload = normalizeAuthPayload(jwt.verify(token, getJwtSecret()));
    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload.userId !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null;
    }
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const maskEmail = (email: string | null | undefined): string => {
  if (!email) return '****';
  const [local, domain] = email.split('@');
  if (!domain) return '****';
  return `${local.charAt(0)}****@${domain}`;
};
