import { Category } from '../top-page.model';
import { IsEnum } from 'class-validator';

export class TopPageFindDto {
    @IsEnum(Category)
        category: Category;
}
