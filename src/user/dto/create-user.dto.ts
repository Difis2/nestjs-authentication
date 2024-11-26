import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters.' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter.' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter.' })
  @Matches(/(?=.*[0-9])/, { message: 'Password must contain at least one number.' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Password must contain at least one special character.' })
  password: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters.' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter.' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter.' })
  @Matches(/(?=.*[0-9])/, { message: 'Password must contain at least one number.' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Password must contain at least one special character.' })
  password: string;
}
