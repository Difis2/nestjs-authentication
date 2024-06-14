import { Module } from '@nestjs/common';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,...drizzleProvider],
})
export class UsersModule {}
