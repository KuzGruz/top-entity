import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../common/decorators';

export class SignUpDto {
  @IsEmail()
  @IsString()
      email: string;

  @MinLength(4)
  @MaxLength(20)
      password: string;

  @Match<SignUpDto>('password', { message: 'Passwords must match' })
      confirmPassword: string;

  @MinLength(2)
  @IsString()
      name: string;
}
