import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect, Types } from 'mongoose';
import { ReviewCreateDto } from 'src/review/dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignInDto } from '../src/auth/dto';

describe('Review Controller (e2e)', () => {
    const productId: string = new Types.ObjectId().toHexString();

    let app: INestApplication;
    let createId: string;
    let token: string;
    const mockReview: ReviewCreateDto = {
        description: 'Description for product',
        title: 'Product title',
        name: 'Test review',
        rating: 5,
        productId
    };

    const signInDto: SignInDto = {
        email: 'tes1wef121@mail.ru',
        password: '1231231'
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const { body } =  await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(signInDto);

        token = body.accessToken;
    });

    it('/review/create (POST) - success', async () => {
        const response = await request(app.getHttpServer()).post('/review/create')
            .send(mockReview)
            .set('Authorization', `Bearer ${token}`);
        createId = response.body._id;

        expect(response.status).toBe(201);
        expect(createId).toBeDefined();
    });

    it('/review/create (POST) - fail', async () => {
        const response = await request(app.getHttpServer())
            .post('/review/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...mockReview, rating: 999 });

        expect(response.status).toBe(400);
    });

    it('/review/byProduct/:productId (GET) - success', async () => {
        const response = await request(app.getHttpServer()).get(`/review/byProduct/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('/review/byProduct/:productId (GET) - fail', async () => {
        const response = await request(app.getHttpServer()).get(`/review/byProduct/${new Types.ObjectId().toHexString()}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    it('/review/:id (DELETE) - success', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/review/${createId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('/review/:id (DELETE) - fail', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/review/${new Types.ObjectId().toHexString()}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    afterAll(() => {
        disconnect();
    });
});
