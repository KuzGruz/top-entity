import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { ReviewCreateDto } from './dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { MongoIdPipe } from '../common/pipes';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    create(@Body() dto: ReviewCreateDto): Promise<DocumentType<ReviewModel>> {
        return this.reviewService.create(dto).then();
    }

    @Get('byProduct/:productId')
    getByProduct(@Param('productId', MongoIdPipe) productId: string): Promise<DocumentType<ReviewModel>[]> {
        return this.reviewService.findByProductId(productId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', MongoIdPipe) id: string): Promise<void> {
        const deletedReview = await this.reviewService.delete(id);

        if (!deletedReview) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }
}
