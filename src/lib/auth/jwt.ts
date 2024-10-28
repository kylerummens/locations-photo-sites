import { JWTPayload, jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type AccountTokenPayload = JWTPayload & {
  id: string;
  domainIdentifier: string;
}

// Helper function to create a signed JWT for the account ID
export async function createSignedToken(account: { id: string, domainIdentifier: string }) {
  return await new SignJWT(account)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4w')
    .sign(secret);
}

// Helper function to verify the account token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify<AccountTokenPayload>(token, secret, { requiredClaims: ['id', 'domainIdentifier'] });
    return payload;
  } catch {
    return null;
  }
}