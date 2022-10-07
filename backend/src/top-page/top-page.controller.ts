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
    Post, Query, UseGuards,
    UsePipes, ValidationPipe
} from '@nestjs/common';
import { TopPageCreateDto, TopPageFindDto } from './dto';
import { MongoIdPipe } from '../common/pipes';
import { TopPageService } from './top-page.service';
import { TopPageModel } from './top-page.model';
import { Types } from 'mongoose';
import { TOP_PAGE_NOT_FOUND_ERROR, TOP_PAGE_SEARCH_ERROR } from './top-page.contants';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {

    constructor(private readonly topPageService: TopPageService) {
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    create(@Body() dto: TopPageCreateDto): Promise<TopPageModel> {
        return this.topPageService.create(dto);
    }

    @HttpCode(200)
    @Get('search')
    search(@Query('text') text: string): Promise<TopPageModel[]> {
        if (!text) {
            throw new HttpException(TOP_PAGE_SEARCH_ERROR, HttpStatus.BAD_REQUEST);
        }
        return this.topPageService.search(text);
    }

    @Get(':id')
    async get(@Param('id', MongoIdPipe) id: string): Promise<TopPageModel> {
        const page = await this.topPageService.getById(id);
        if (!page) {
            throw new HttpException(TOP_PAGE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        return page;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', MongoIdPipe) id: string): Promise<Types.ObjectId> {
        const pageId = await this.topPageService.deleteById(id);
        if (!pageId) {
            throw new HttpException(TOP_PAGE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        return pageId;
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(@Param('id', MongoIdPipe) id: string, @Body() dto: TopPageCreateDto): Promise<TopPageModel> {
        const page = await this.topPageService.update(id, dto);
        if (!page) {
            throw new HttpException(TOP_PAGE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        return page;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    find(@Body() dto: TopPageFindDto): Promise<TopPageModel[]> {
        return this.topPageService.find(dto);
    }
}
