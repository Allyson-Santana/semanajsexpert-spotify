import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import TestUtil from '../_util/testUtil.js'
import { handler } from '../../../server/routes.js';
import { Controller } from '../../../server/controller.js';

const { 
    pages, 
    location, 
    constants: {
        CONTENT_TYPE    
    } 
} = config;

describe('API E2E Suite Test', () => {

    describe('client workflow', () => {
        
        test.todo('it should not receive data stream if the process is not playing');
        test.todo('it should  receive data stream if the process is  playing');
 
    });

});