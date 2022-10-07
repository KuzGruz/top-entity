import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { index, prop } from '@typegoose/typegoose';

export enum Category {
    Courses,
    Services,
    Books,
    Products
}

class HHInformation {
    @prop()
        count: number;

    @prop()
        juniorSalary: number;

    @prop()
        middleSalary: number;

    @prop()
        seniorSalary: number;
}

class Advantage {
    @prop()
        title: string;

    @prop()
        description: string;
}

export interface TopPageModel extends Base {
}

@index({title: 'text', seo: 'text'})
export class TopPageModel extends TimeStamps {
    @prop({enum: Category})
        category: Category;

    @prop()
        subCategory: string;

    @prop()
        title: string;

    @prop({unique: true})
        alias: string;

    @prop()
        entityCategory: string;

    @prop({type: () => HHInformation})
        hh?: HHInformation;

    @prop({type: () => [Advantage]})
        advantages: Advantage[];

    @prop()
        seo: string;

    @prop({type: () => [String]})
        tags: string[];

    @prop()
        tagsTitle?: string;
}
