import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/redirect')
  google(@Res() res: Response) {
    const url = this.authService.googleRedirect();
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(@Query() query: { code: string }, @Res() res: Response) {
    const code = query.code;
    const tokenData = await this.authService.googleCallback(code);
    if (!tokenData) {
      throw new Error("Can't get token");
    }
    const accessToken = (tokenData as { access_token: string }).access_token;
    return res.redirect(
      process.env.GOOGLE_FRONTEND_URL + `?accessToken=${accessToken}`,
    );
  }

  @Post('google/callback')
  async googleCallbackPost(@Body() { accessToken }: { accessToken: string }) {
    return this.authService.googleLogin(accessToken);
  }

  @Post('login')
  async login(@Body() body: any) {
    const attempt = await this.authService.login(body);
    if (!attempt) {
      throw new UnauthorizedException('Email hoac mat khau khong chinh xac');
    }
    return attempt;
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('/refresh-token')
  async refeshToken(@Body() body: any) {
    const result = await this.authService.refreshToken(body);
    if (!result) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@Request() req: any) {
    const { user } = req;
    const jti = user.jti;
    const exp = user.exp;
    return this.authService.logout(jti, exp);
  }

  @Patch('/profile')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Request() req: any,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.authService.updateUser(req.user, body, file);
    if (!data) {
      return {
        success: false,
        message: 'Email đã tồn tại',
      };
    }

    return data;
  }
}
