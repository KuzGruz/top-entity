import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { TopPageModel } from './top-page.model';
import { TopPageCreateDto, TopPageFindDto } from './dto';

@Injectable()
export class TopPageService {
    constructor(@InjectModel(TopPageModel) private readonly model: ModelType<TopPageModel>) {
    }

    create(dto: TopPageCreateDto): Promise<TopPageModel> {
        return this.model.create(dto);
    }

    getById(id: string): Promise<TopPageModel> {
        return this.model.findById(id).exec();
    }

    async deleteById(id: string): Promise<Types.ObjectId> {
        const user = await this.model.findByIdAndDelete(id).exec();
        return user._id;
    }

    async update(id: string, dto: TopPageCreateDto): Promise<TopPageModel> {
        return this.model.findByIdAndUpdate(id, dto, {new: true}).exec();
    }

    async find(dto: TopPageFindDto): Promise<TopPageModel[]> {
        return this.model.aggregate([
            {
                $match: dto
            },
            {
                $group: {
                    _id: {subCategory: '$subCategory'},
                    pages: {$push: {alias: '$alias', title: '$title'}}
                }
            }
        ]).exec();
    }

    async search(text: string): Promise<TopPageModel[]> {
        return this.model.find({
            $text: {
                $search: text,
                $caseSensitive: false
            }
        });
    }
}
