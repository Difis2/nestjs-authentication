import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { compare } from 'bcryptjs';
import { CreateUserDto, SignInDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(dto: SignInDto): Promise<any> {
    console.log(dto);
    const user = await this.usersService.findOneByEmail(dto.email);
    const isPasswordCorrect = await compare(dto.password, user.password);
    if (!user || !isPasswordCorrect) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(dto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) {
      throw new Error('Email is already registered!');
    }
    return this.usersService.create(dto);
  }
}
