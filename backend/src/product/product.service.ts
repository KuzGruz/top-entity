import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ProductCreateDto } from './dto';
import { Types } from 'mongoose';
import { ProductFindDto } from './dto';
import { ProductWithReview } from './product.types';

@Injectable()
export class ProductService {
    constructor(@InjectModel(ProductModel) private readonly model: ModelType<ProductModel>) {
    }

    create(dto: ProductCreateDto): Promise<ProductModel> {
        return this.model.create(dto);
    }

    getById(id: string): Promise<ProductModel> {
        return this.model.findById(id).exec();
    }

    async deleteById(id: string): Promise<Types.ObjectId> {
        const user = await this.model.findByIdAndDelete(id).exec();
        return user._id;
    }

    async update(id: string, dto: ProductCreateDto): Promise<ProductModel> {
        return this.model.findByIdAndUpdate(id, dto, {new: true}).exec();
    }

    async findWithReviews(dto: ProductFindDto): Promise<ProductWithReview[]> {
        return await this.model.aggregate([
            {
                $match: {
                    categories: dto.category
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $limit: dto.limit
            },
            {
                $lookup: {
                    from: 'Review',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    reviewCount: {$size: '$reviews'},
                    reviewAvg: {$avg: '$reviews.rating'}
                }
            }
        ]).exec() as ProductWithReview[];
    }
}
