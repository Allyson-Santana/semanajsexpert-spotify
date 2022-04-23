import fs from 'fs';
import config from './config.js';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { PassThrough, Writable } from 'stream';
import Throttle from 'throttle';
import childProcess from 'child_process'
import { logger } from './util.js';
import StreamsPromises from 'stream/promises';
import { once } from 'events';

const {
    constants: {
        englishConversation,
        fallbackBitRate,
        bitRateDivisor
    },
    dir: {
        publicDirectory
    }
} = config

export class Service {

    constructor() {
        this.clientStreams = new Map();
        this.currentSong = englishConversation;
        this.currentBitrate = 0;
        this.throttleTransform = {};
        this.currentReadable = {};
    }

    createClientStream() {
        const id = randomUUID();
        const clientStream = new PassThrough();
        this.clientStreams.set(id, clientStream);

        return { id, clientStream };
    }

    removeClientStream(id) {
        this.clientStreams.delete(id);
    }

    createFileStream(filename) {
        return fs.createReadStream(filename);
    }

    _executeSoxCommand(args) {
        return childProcess.spawn('sox', args)
    }

    async getBitRate(song) {
        try {
            const args = [
                '--i', // info
                '-B', // bitrate,
                song
            ];
            const { 
                stderr, // errors all
                stdout, // logs All
                //stdin // send data with type stream 
            } = this._executeSoxCommand(args);

            await Promise.all([
                once(stderr, 'readable'),
                once(stdout, 'readable')
            ]);

           const [ success, error ] = [ stdout, stderr ].map(stream => stream.read());
           if(error) return await Promise.reject(error);

           return success.toString().trim().replace(/k/,'000');

        } catch (error) {
            logger.error(`Error at bitRate: ${error}`);
            return fallbackBitRate;
        } 
    }

    broadCast() {
        return new Writable({
            write: (chunk, enc, cb) => {
                for (const [id, stream] of this.clientStreams) {
                    if(stream.writableEnded) {
                        this.clientStreams.delete(id);
                        continue; 
                    }

                    stream.write(chunk);
                }
                cb();
            }
        });
    }

    async startStreamming() {
        logger.info(`Starting with ${this.currentSong}`);
        const bitRate = this.currentBitrate =  (await this.getBitRate(this.currentSong)) / bitRateDivisor;
        const throttleTransform = this.throttleTransform = new Throttle(bitRate)
        const songReadable = this.currentReadable = this.createFileStream(this.currentSong);
        return StreamsPromises.pipeline(
            songReadable,
            throttleTransform,
            this.broadCast()
        );
    }

    stopStreamming() {
        this.throttleTransform?.end?.();
    }

    async getFileInfo(file) {
        const fullFilePath = join(publicDirectory, file);
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