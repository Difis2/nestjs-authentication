import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
  Query,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jtw.guard';
import { GoogleOAuthGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
  @UseGuards(JwtAuthGuard) // Ensure the user is authenticated before sending an email
  @Get('send-email')
  async sendVerificationEmail(@Req() request: any) {
    const userEmail = request.user.email; // Get user email from the request or JWT payload
    await this.authService.sendVerificationEmail(userEmail);
    return {
      message: 'Verification email sent successfully!',
    };
  }
  // Endpoint to verify the token
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const isVerify = await this.authService.verifyEmail(token);
      if (!isVerify) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return { message: 'Email successfully verified!' };
    } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }
  }
}
