/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Handle Google authentication initiation logic here if needed
  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.appService.googleLogin(req);
  }
}
