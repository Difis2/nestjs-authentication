import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import * as schema from './../drizzle/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>
  ) {}

  async login(user: User): Promise<any> {
    const payload = { sub: user.id, email: user.email };
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
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
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
        .insert(schema.users)
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
  async sendMail() {
    const html = `<p>Hello, <br/> <br/> Thank you for using our app! Here is your verification code to continue:</p> <h1>123456</h1> <p>Please enter this code on the verification page to proceed. If you did not request this code, you can safely ignore it or contact our support team. <br/> <br/> Thank you, <br/>The Shida Team</p> <hr/> <p style="text-align:center"><strong>OurApp</strong> <br/> ourapp  |  Help Center  |  Privacy Policy  |  Terms of Service <br/> Connect with us: <br/>  Facebook  |  Twitter  |  LinkedIn <br/> <br/> © 2023 Shida. All Rights Reserved.</p> `;

    this.mailService.sendMail({
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to: 'diogofgsoares@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      html: html,
    });
  }
}
