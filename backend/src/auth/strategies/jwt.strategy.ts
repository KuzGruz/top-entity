import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private  readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.get('JWT_SECRET')
        });
    }

    validate({ email }: JwtPayload): any {
        return email;
    }
}
