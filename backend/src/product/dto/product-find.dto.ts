import { IsNumber, IsString } from 'class-validator';

export class ProductFindDto {
    @IsString()
        category: string;

    @IsNumber()
        limit: number;
}
