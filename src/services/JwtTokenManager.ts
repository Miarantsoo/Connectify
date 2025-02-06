import { sign, verify, decode, JwtPayload } from 'jsonwebtoken';
import { Request } from 'express'

export class JwtTokenManager {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    createToken(claims: Record<string, any>, expirationInSeconds: number): string {
        return sign(claims, this.secretKey, { expiresIn: expirationInSeconds });
    }

    validateToken(token: string): boolean {
        try {
            verify(token, this.secretKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    parseToken(token: string): JwtPayload | null {
        try {
            return decode(token) as JwtPayload;
        } catch (e) {
            return null;
        }
    }

    extractTokenFromRequest(req: Request): string | null {
        // @ts-ignore
        const authHeader = req.headers['authorization'];
        if (authHeader && /^Bearer\s(\S+)$/.test(authHeader)) {
            return authHeader.split(' ')[1];
        }
        return null;
    }
}