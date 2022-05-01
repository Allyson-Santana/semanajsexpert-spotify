  import server from './server.js'; 
  import { logger } from './util.js';
  import config from './config.js'

server.listen(config.port)
 .on('Listening', () => logger.info(`Server running at ${config.port}`));

// impede que a aplicação caia, caso um erro não tratado aconteça!
// uncaughtException => throw
// unhandledRejection => Promises
process.on('uncaughtException', (error) => logger.error(`unhandledRejection happened: ${error.stack || error }`))
process.on('unhandledRejection', (error) => logger.error(`unhandledRejection happened: ${error.stack || error }`))