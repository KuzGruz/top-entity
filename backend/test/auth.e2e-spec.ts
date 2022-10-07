import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignInDto } from '../src/auth/dto';

describe('Auth Controller (e2e)', () => {
    const mockUser: SignInDto = {
        email: 'tes1wef121@mail.ru',
        password: '1231231'
    };

    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/sign-in (POST) - success', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(mockUser);

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    });

    it('/auth/sign-in (POST) - wrong email', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ ...mockUser, email: 'failEmail@mail.ru' });

        expect(response.status).toBe(404);
    });

    it('/auth/sign-in (POST) - wrong password', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ ...mockUser, password: 'failPassword' });

        expect(response.status).toBe(401);
    });

    afterAll(() => {
        disconnect();
    });
});
