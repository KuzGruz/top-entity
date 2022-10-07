import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponseDto } from './dto';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {

    async save(files: MFile[]): Promise<FileResponseDto[]> {
        const dateFolder = format(new Date(), 'yyyy-MM-dd');
        const uploadFolder = `${path}/uploads/${dateFolder}`;
        await ensureDir(uploadFolder);
        const response: FileResponseDto[] = [];
        for (const file of files) {
            const fileName = file.originalname;
            await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
            response.push({url: `${dateFolder}/${fileName}`, name: fileName});
        }

        return response;
    }

    async convertToWebP(file: Buffer): Promise<Buffer> {
        return sharp(file).webp().toBuffer();
    }
}
