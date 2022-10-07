import { Category } from '../top-page.model';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HHInformationDto {
    @IsNumber()
        count: number;

    @IsNumber()
        juniorSalary: number;

    @IsNumber()
        middleSalary: number;

    @IsNumber()
        seniorSalary: number;
}

class   AdvantageDto {
    @IsString()
        title: string;

    @IsString()
        description: string;
}

export class TopPageCreateDto {
    @IsEnum(Category)
        category: Category;

    @IsString()
        subCategory: string;

    @IsString()
        title: string;

    @IsString()
        alias: string;

    @IsString()
        entityCategory: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => HHInformationDto)
        hh?: HHInformationDto;

    @IsArray()
    @ValidateNested()
    @Type(() => AdvantageDto)
        advantages: AdvantageDto[];

    @IsString()
        seo: string;

    @IsArray()
    @IsString({each: true})
        tags: string[];

    @IsOptional()
    @IsString()
        tagsTitle?: string;
}
