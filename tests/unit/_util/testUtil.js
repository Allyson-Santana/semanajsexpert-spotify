import { jest } from '@jest/globals';
import { Readable, Writable } from 'stream';

export default class TestUtil {

    static generateReadableStrem(data) {
        return new Readable({
            read() {
                for (const item of data) {
                    this.push(item);
                }

                this.push(null);
            }
        })
    }

    static generateWritableStrem(onData) {
        return new Writable({
            write(chunk, enc, cb) {
                onData(chunk);
                
                cb(null, chunk);
            }
        })
    }
   
    static defaultHandleParams() {
        const requestStream = TestUtil.generateReadableStrem(['body request']);
        const responseStream = TestUtil.generateWritableStrem(() => {});
        const data = {
            request: Object.assign(requestStream,  {
                headers: {},
                method: '',
                url: ''
            }),
            response: Object.assign(responseStream, {
                writeHead: jest.fn(),
                end: jest.fn()
            })
        }

        return {
            values: () => Object.values(data),
            ...data
        }

    }


}
