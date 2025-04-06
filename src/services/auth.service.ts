// src/services/jwt.service.ts
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { AppError } from '@src/helpers/AppError';
import { UserDocument } from '@src/interfaces/mongoose.gen';
import { UserService } from './user.service';

interface TokenPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

class JwtService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor() {
    // Load from environment variables
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    this.accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  /**
   * Generate JWT tokens for a user
   */
  public async generateTokens(user: UserDocument): Promise<Tokens> {
    const payload = {
      id: user._id.toString(),
      email: user.email,
    };

    const accessToken = jwt.sign(
      payload,
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiresIn as any }
    );

    const refreshToken = jwt.sign(
      payload,
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiresIn as any }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  public async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
        jwt.verify
        return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (err) {
      throw new AppError('Invalid access token', 401);
    }
  }

  /**
   * Verify refresh token
   */
  public async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return await jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
    } catch (err) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  /**
   * Refresh tokens using a valid refresh token
   */
  public async refreshTokens(refreshToken: string): Promise<Tokens> {
    const decoded = await this.verifyRefreshToken(refreshToken);
    
    // In a real app, you would check if the refresh token exists in your database
    // and is not revoked/expired
    const user = await UserService.findUser({id: decoded.id});
    if(!user) throw new AppError("User for this token not found", 401);
    return this.generateTokens(user);
  }

  /**
   * Extract token from authorization header
   */
  public extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new AppError('Authorization header missing', 401);
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new AppError('Invalid authorization header format', 401);
    }

    return token;
  }
}

export const jwtService = new JwtService();