const { createLoggerInstance } = require('../../../../utils/logger');
const { registerAptosName } = require('./mintDomain');


const aptos_key = '0xb43309d8133b4d42c558b3ac211eee4623bb3dcbf012d9b03ca66c76a288606e';
const accountIndex = 0;
const logger = createLoggerInstance();
const moduleName = 'Aptos Names Mint';


registerAptosName(aptos_key, logger, accountIndex, moduleName);
