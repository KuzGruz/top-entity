import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { ReviewCreateDto } from './dto';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(ReviewModel) private readonly model: ModelType<ReviewModel>) {
    }

    create(dto: ReviewCreateDto): Promise<DocumentType<ReviewModel>> {
        return this.model.create(dto);
    }

    delete(id: string): Promise<DocumentType<ReviewModel> | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    deleteAllByProductId(productId: string): Promise<DeleteResult> {
        return this.model.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
    }

    findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
        return this.model.find({ productId: new Types.ObjectId(productId) }).exec();
    }
}
