import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';
import { IncorrectCredentialsError } from './auth.errors';
import { AuthService } from './auth.service';
import { ACCESS_COOKIE } from '../app.constants';
import { ThrottlerGuard } from "@nestjs/throttler";
import { Public } from "../core/decorators/public.decorator";

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  public async login(
    @Req() request: Request,
    @Body() userBody: { name: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    if (!userBody?.name || !userBody?.password) {
      throw new IncorrectCredentialsError();
    }

    const user = await this.authService.validateUser(
      userBody.name,
      userBody.password,
      request.em,
    );

    if (!user) {
      throw new IncorrectCredentialsError();
    }

    response.cookie(ACCESS_COOKIE, this.authService.generateAccessToken(user), {
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      path: '/',
      secure: false,
      httpOnly: true,
      domain: undefined,
    });

    return true;
  }

  @Public()
  @Get('logout')
  public logout(@Res({ passthrough: true }) response: Response): boolean {
    response.clearCookie(ACCESS_COOKIE, {
      path: '/',
      secure: false,
      httpOnly: true,
      domain: undefined,
    });

    return true;
  }
}
