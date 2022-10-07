import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

const INVALID_MONGO_ID = 'Invalid mongo id';

@Injectable()
export class MongoIdPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (metadata.type !== 'param') {
            return value;
        }
        if (!Types.ObjectId.isValid(value)) {
            throw new HttpException(INVALID_MONGO_ID, HttpStatus.BAD_REQUEST);
        }

        return value;
    }
}
