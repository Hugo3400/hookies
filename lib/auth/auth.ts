import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
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
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  try {
    return normalizeAuthPayload(jwt.verify(token, JWT_SECRET));
  } catch (error) {
    return null;
  }
};
