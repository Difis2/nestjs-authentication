import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtStrategy } from './strategys/jwt.strategy';
import { GoogleStrategy } from './strategys/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...drizzleProvider, UsersService, LocalStrategy, JwtStrategy, GoogleStrategy],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class AuthModule {}
