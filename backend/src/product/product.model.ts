import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

class ProductCharacteristics {
  @prop()
      name: string;

  @prop()
      value: string;
}

export interface ProductModel extends Base {}

export class ProductModel extends TimeStamps {
  @prop()
      image: string;

  @prop()
      title: string;

  @prop()
      price: number;

  @prop()
      oldPrice?: number;

  @prop()
      credit: number;

  @prop()
      description: string;

  @prop()
      rating: number;

  @prop()
      advantages: string;

  @prop()
      disadvantages: string;

  @prop({ type: () => [String] })
      categories: string[];

  @prop({ type: () => [String] })
      tags: string[];

  @prop({ type: () => [ProductCharacteristics], _id: false })
      characteristics: ProductCharacteristics[];
}