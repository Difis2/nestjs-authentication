import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...drizzleProvider,UsersService]
})
export class AuthModule {}
