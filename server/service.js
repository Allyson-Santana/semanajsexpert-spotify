import fs from 'fs';
import config from './config.js';
import { join, extname } from 'path';

export class Service {
    createFileStream(filename) {
        return fs.createReadStream(filename);
    }

    async getFileInfo(file) {
        const fullFilePath = join(config.dir.publicDirectory, file);
        await fs.promises.access(fullFilePath);
        const fileType = extname(fullFilePath);
        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file) {
        
        const { type, name } = await this.getFileInfo(file);

        return {
            stream: this.createFileStream(name),
            type: type
        }

    }



}