import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtStrategy } from './strategys/jwt.strategy';
import { GoogleStrategy } from './strategys/google.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...drizzleProvider, UsersService, LocalStrategy, JwtStrategy, GoogleStrategy],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: '60s' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
        port: 465,
        tls: isProduction
          ? {} // Enforce stricter rules in production
          : { rejectUnauthorized: false }, // Relax rules for development
      },
    }),
  ],
})
export class AuthModule {}
