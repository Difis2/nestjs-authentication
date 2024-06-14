import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { compare } from 'bcryptjs';
import { CreateUserDto, SignInDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(dto: SignInDto): Promise<any> {
    console.log(dto);
    const user = await this.usersService.findOneByEmail(dto.email);
    const isPasswordCorrect = await compare(dto.password, user.password);
    if (!user || !isPasswordCorrect) {
      throw new UnauthorizedException();
    }
    const { ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
  async register(dto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) {
      throw new Error('Email is already registered!');
    }
    return this.usersService.create(dto);
  }
}
