import { ProductModel } from './product.model';
import { ReviewModel } from '../review/review.model';

export type ProductWithReview = ProductModel & { reviews: ReviewModel[], reviewCount: number, reviewAvg: number };
