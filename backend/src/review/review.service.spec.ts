import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewService } from './review.service';

describe('Review Service', () => {
    let service: ReviewService;

    const exec = { exec: jest.fn() };

    const reviewRepositoryFactory = () => ({
        find: () => exec
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: getModelToken('ReviewModel'),
                    useFactory: reviewRepositoryFactory
                }
            ]
        }).compile();

        service = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be find product by id', async () => {
        const id = new Types.ObjectId().toHexString();
        reviewRepositoryFactory()
            .find()
            .exec.mockReturnValueOnce([{ productId: id }]);

        const response = await service.findByProductId(id);
        expect(response[0].productId).toBe(id);
    });
});
