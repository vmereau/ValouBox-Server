import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../core/decorators/public.decorator";
import { UnauthorizedUserError } from "./auth.errors";
import { JwtPayload, JwtType } from "./auth.types";
import { UserDao } from "../core/dao/user.dao";
import { User } from "../../graphql";

/**
 * Authenticate by JWT and check for user availability
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userDao: UserDao
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If a route is decorated by @Public(), skip the authentication check
    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    let token;

    // Search the JWT
    for (const extract of [this.extractTokenFromCookie, this.extractTokenFromHeader]) {
      token = extract(request);

      if (token) {
        break;
      }
    }

    if (!token) {
      throw new UnauthorizedUserError();
    }

    let payload: JwtPayload;

    // JWT check
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

    } catch {
      throw new UnauthorizedUserError();
    }

    if (payload.type !== JwtType.Access) {
      throw new UnauthorizedUserError();
    }

    const userId = Number.parseInt(payload.sub);
    request['user'] = await this.userDao.findOneById(userId);

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    let accessToken = "";

    if(!request.cookies?.access_token){
      const cookiesHeaders = request.headers.cookie;

      for (const cookieString of cookiesHeaders.split("; ")) {
        if(cookieString.includes("access_token")) {
          accessToken = cookieString.split("=")[1];
          break;
        }
      }
    }

    return request.cookies?.access_token || accessToken || undefined;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
