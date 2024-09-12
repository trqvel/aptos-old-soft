const { AptoswapClient } = require("@vividnetwork/swap-sdk");
const { AptosClient, CoinClient } = require("aptos")
const { NODE_URL, TokensMapping, APTOSWAP_URL,Contracts } = require("../../../utils/common");
const {SDK} = require("@pontem/liquidswap-sdk");
const { logsHelper } = require('../../../utils/logsHelper')
const {
    getSDKOptions,
    getCfgSettingsBurnLP,
    setupAddLPBalance,
    submitTransactionCheck,
    setupDelayFunc,
    getRandomPair,
    checkBalances
} = require("../../../utils/script_helpers");

const {
    performBurnOperation
} = require('./utils/performBurnOperation');
const { setupTxPayload } = require("./utils/helpers");

const {
    LiquidSwap_burnLP

} = require('./utils/liquidswap/burnLP');

async function mainBurnLPFunction(pontemKey, logger, addressIndex,module_name){

    if (module_name === 'LiquidSwap'){
        await LiquidSwap_burnLP(pontemKey, addressIndex, logger)
    }else{
        const sdkOptions = {
            nodeUrl: NODE_URL,
            networkOptions: {
                modules: {
                    Scripts: `0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2`,
                    CoinInfo: '0x1::coin::CoinInfo',
                    CoinStore: '0x1::coin::CoinStore',
                },
            },
        };
        const sdk = new SDK(sdkOptions)
        const [delay_txns,pools_for_burn_lp] = await getCfgSettingsBurnLP(module_name)
        const len = pools_for_burn_lp.length

        const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)
        for (let i = 0; i < len; i++){

            const [src,dst] = await getRandomPair(pools_for_burn_lp)
            const moduleString = `[Account ${addressIndex}][${module_name}][BurnLP]`
            logger.info(`${moduleString} - Selected pair ${src}/${dst}`)

            if (dst === 'USDC')
            {
                const lpaptusdcbalanceString = `${module_name}_LPAPTUSDC`
                let lpaptusdcbalance = await checkBalances(address, coinClient, client,lpaptusdcbalanceString)
                if (lpaptusdcbalance > 0 && lpaptusdcbalance !== undefined){
                    const [fromToken, toToken,pool,balance,toAmountVal] =  await performBurnOperation("APT", 'USDC', lpaptusdcbalance, addressIndex, logger, sdk, client, address, account, aptoswapClient, 0.005,module_name)
                    logger.info(`${moduleString} - Burning ${balance / 10 ** 6} LP${fromToken}${toToken} | Get ${lpaptusdcbalance / 10 ** 8} ${fromToken}`);
                    const txPayload = await setupTxPayload(fromToken, toToken,pool,balance,toAmountVal,module_name)
                    const [flag,hash] = await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
                    if (flag){
                        const logs = new logsHelper(address, 'APT', 'USDC', lpaptusdcbalance, `https://explorer.aptoslabs.com/txn/${hash}`, module_name,'BurnLP',1);
                        logs.log_to_excel()
                            .then(() => logger.info(`${moduleString} - Data logged successfully`))
                            .catch((error) => logger.info('Error via logs:', error));
                    }
                    await setupDelayFunc(delay_txns,moduleString,logger)
                }
            }

            if ( dst === "USDT"){

                const lpaptusdtbalanceString = `${module_name}_LPAPTUSDT`
                let lpaptusdtbalance = await checkBalances(address, coinClient, client,lpaptusdtbalanceString)

                if (lpaptusdtbalance > 0 && lpaptusdtbalance != undefined){
                    const [fromToken, toToken,pool,balance,toAmountVal] =  await performBurnOperation("APT", 'USDT', lpaptusdtbalance, addressIndex, logger, sdk, client, address, account, aptoswapClient, 0.005,module_name)
                    logger.info(`${moduleString} - Burning ${balance / 10 ** 6} LP${fromToken}${toToken} | Get ${lpaptusdtbalance / 10 ** 8} ${fromToken}`);
                    const txPayload = await setupTxPayload(fromToken, toToken,pool,balance,toAmountVal,module_name)
                    const [flag,hash] = await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
                    if (flag){
                        const logs = new logsHelper(address,'APT', 'USDT', lpaptusdtbalance, `https://explorer.aptoslabs.com/txn/${hash}`, module_name,'BurnLP',1);
                        logs.log_to_excel()
                            .then(() => logger.info(`${moduleString} - Data logged successfully`))
                            .catch((error) => logger.info('Error via logs:', error));
                    }
                    await setupDelayFunc(delay_txns,moduleString,logger)
                }
            }
        }

    }
}
module.exports ={
    mainBurnLPFunction
}