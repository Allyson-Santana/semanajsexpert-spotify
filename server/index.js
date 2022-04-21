  import server from './server.js'; 
  import { logger } from './util.js';
  import config from './config.js'

  server.listen(config.port)
    .on('Listening', () => logger.info(`Server running at ${config.port}`));