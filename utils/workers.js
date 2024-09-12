const { parentPort, workerData } = require('worker_threads');
const { mmKey, pontemKey, okecx, addressIndex } = workerData;
const { createLoggerInstance } = require('./logger.js');
const { startModules } = require('./activateModules')
const {shuffle} = require('../config').General;
const {useBridge,withdrawalFromOkxForBridge} = require('../config').AptosBridge
const {OKX_withdrawOutBridge} = require('../okx/withdraw_for_bridge.js')

    function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const {
    withdraw_in_module,
    withdraw_out_module
} = require("../config").OKX;

async function processAccount(mmKey, pontemKey, okecx, addressIndex) {
    try {
        const logger = createLoggerInstance(addressIndex);
        const activeModules = require('../config').ActiveModules;

        if (useBridge){

            if (withdrawalFromOkxForBridge){
                await OKX_withdrawOutBridge(mmKey,addressIndex,logger)
            }
            const bridge = await import('../modules/bridge/indexBridge.js')
            await bridge.mainFunctionBridge(mmKey,pontemKey,logger,`[Account ${addressIndex}][Bridge]`)

        }

        if (withdraw_in_module) {
            const withdrawOut = await import('../okx/withdraw_out.js');
            // const delaySeconds =  Math.floor(Math.random() * (120 - 10 + 1)) + 10;
			// console.log('Ждем ', delaySeconds)
            // await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
            await withdrawOut.OKX_withdrawOut(pontemKey, addressIndex, logger)
        }

        const claim = await import('./claim_and_register_tokens.js');
        await claim.claim_and_register(mmKey, pontemKey, addressIndex,logger);
        
        
        if (shuffle) {
            let shuffleArr =  shuffleArray(activeModules.modules) ;
            for (const module_name of shuffleArr) {
                await startModules(module_name, mmKey, pontemKey, okecx, addressIndex, logger);
            }
        } else {
            for (const module_name of activeModules.modules) {
                await startModules(module_name, mmKey, pontemKey, okecx, addressIndex, logger);
            }
        }
        
        if (withdraw_out_module) {
            const withdrawIn = await import('../okx/withdraw_in.js');
            await withdrawIn.OKX_withdrawIn(pontemKey, okecx, addressIndex, logger);
        }
 
    } catch (error) {
        console.error(`[Account ${addressIndex}] Возникла ошибка при выполнении ${error.message}, поток остановлен:`, error.stack);
    }
}

(async () => {
    try {
        await processAccount(mmKey, pontemKey, okecx, addressIndex);
        parentPort.postMessage('Job done!');
        parentPort.close();
    } catch (err) {
        console.error(err);
        parentPort.postMessage('Error occurred!');
    }
})();
