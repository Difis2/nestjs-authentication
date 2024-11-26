import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './../drizzle/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.db
      .insert(schema.users)
      .values({
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      })
      .returning();
    const { ...result } = newUser[0];
    return {
      message: 'Account registered successfully!',
      user: result,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneById(id: number) {
    return await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  }
  async findOneByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }
  async findOneByUsername(username: string) {
    return await this.db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
