import { IsString, Max, Min, IsNumber } from 'class-validator';

export class ReviewCreateDto {
  @IsString()
      name: string;

  @IsString()
      title: string;

  @IsString()
      description: string;

  @Max(5, { message: 'Max rating is 5' })
  @Min(1, { message: 'Min rating is 1' })
  @IsNumber()
      rating: number;

  @IsString()
      productId: string;
}
