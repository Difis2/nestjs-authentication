import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import * as schema from './../drizzle/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>
  ) {}

  async login(user: User): Promise<any> {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(dto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (user) {
      throw new Error('Email is already registered!');
    }
    return this.usersService.create(dto);
  }
  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await compare(pass, user.password);
    if (!isPasswordCorrect) return null;
    return user;
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    const user = await this.usersService.findOneByEmail(req.user.email);
    if (!user) {
      const newUser = await this.db
        .insert(schema.user)
        .values({
          email: req.user.email,
          password: undefined,
          username: undefined,
          image: req.user.picture,
          isEmailVerified: true,
        })
        .returning();
      const { ...result } = newUser[0];
      return result;
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
