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
    // Check the user's role
    const payload = { sub: user.id, email: user.email };
    // If the user is an admin, generate an admin token with additional claims
    if (user.role === 'admin') {
      payload['role'] = 'admin';
      return {
        access_token: await this.jwtService.signAsync(payload),
        role: 'admin',
      };
    }

    // For regular users, generate a standard token
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: 'user',
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
  async generateVerificationToken(userEmail: string): Promise<string> {
    const payload = { email: userEmail };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.VERIFY_JWT_TOKEN, // Use a strong secret key
      expiresIn: '1h', // Expiration time (1 hour)
    });
  }
  // Send verification email with a verification link
  async sendVerificationEmail(userEmail: string): Promise<void> {
    const verificationToken = await this.generateVerificationToken(userEmail);

    const verificationLink = `${process.env.APP_URL}/api/auth/verify-email?token=${verificationToken}`;

    const html = `
        <p>Hello,</p>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not request this, please ignore this email.</p>
      `;

    await this.mailService.sendMail({
      to: userEmail,
      subject: 'Email Verification',
      html: html,
    });
  }
  async verifyEmail(token: string): Promise<boolean> {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: process.env.VERIFY_JWT_TOKEN, // Use the same secret used to sign the token
    });

    // Find user by email and activate account
    const user = await this.usersService.findOneByEmail(decoded.email);
    if (!user) {
      return false;
    }

    // Set the user's email verified status to true
    await this.usersService.updateVerification(user.id); // Update the user in the database
    return true;
  }
}
