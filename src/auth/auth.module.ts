import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...drizzleProvider,UserService]
})
export class AuthModule {}
