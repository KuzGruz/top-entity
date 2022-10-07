import { ALREADY_EXIST_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';

import { SignInDto, SignUpDto } from './dto';
import { Types } from 'mongoose';
import { JwtFormat } from './strategies/jwt.types';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

  @UsePipes(new ValidationPipe())
  @Post('sign-up')
    async signUp(@Body() dto: SignUpDto): Promise<Types.ObjectId> {
        const existingUser = await this.authService.findUserByEmail(dto.email);

        if (existingUser) {
            throw new HttpException(ALREADY_EXIST_ERROR, HttpStatus.BAD_REQUEST);
        }
        const user = await this.authService.createUser(dto);

        return user._id;
    }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto): Promise<JwtFormat> {
      const { email } = await this.authService.validate(dto);
      return this.authService.signIn(email);
  }
}
