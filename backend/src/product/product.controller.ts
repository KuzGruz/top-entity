import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post, UseGuards,
    UsePipes, ValidationPipe
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { ProductFindDto } from './dto';
import { ProductCreateDto } from './dto';
import { ProductService } from './product.service';
import { Types } from 'mongoose';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductWithReview } from './product.types';
import { MongoIdPipe } from '../common/pipes';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    create(@Body() dto: ProductCreateDto): Promise<ProductModel> {
        return this.productService.create(dto);
    }

    @Get(':id')
    async get(@Param('id', MongoIdPipe) id: string): Promise<ProductModel> {
        const product = await this.productService.getById(id);
        if (!product) {
            throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
        return product;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', MongoIdPipe) id: string): Promise<Types.ObjectId> {
        const objectId = await this.productService.deleteById(id);
        if (!objectId) {
            throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
        return objectId;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async patch(@Param('id', MongoIdPipe) id: string, @Body() dto: ProductCreateDto): Promise<ProductModel> {
        const product = await this.productService.update(id, dto);
        if (!product) {
            throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
        return product;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    find(@Body() dto: ProductFindDto): Promise<ProductWithReview[]> {
        return this.productService.findWithReviews(dto);
    }
}
