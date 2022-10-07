import { SignInDto } from './dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hashSync, compare } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { SignUpDto } from './dto';
import { UserModel } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { JwtFormat } from './strategies/jwt.types';

@Injectable()
export class AuthService {

    constructor(@InjectModel(UserModel) private readonly model: ModelType<UserModel>,
              private readonly jwtService: JwtService) {
    }

    async createUser({ email, name, password }: SignUpDto): Promise<UserModel> {
        const salt = await genSalt(10);
        const user = new this.model({ email, name, passwordHash: hashSync(password, salt) });

        return user.save();
    }

    findUserByEmail(email: string): Promise<UserModel> {
        return this.model.findOne({ email }).exec();
    }

    async validate({ email, password }: SignInDto): Promise<Pick<UserModel, 'email'>> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        const passwordIsCorrect = await compare(password, user.passwordHash);

        if (!passwordIsCorrect) {
            throw new HttpException(WRONG_PASSWORD_ERROR, HttpStatus.UNAUTHORIZED);
        }

        return { email: user.email };
    }

    async signIn(email: string): Promise<JwtFormat> {
        return { accessToken: await this.jwtService.signAsync({ email }) };
    }
}
