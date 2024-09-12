const { APTOSWAP_URL, NODE_URL } = require('../../../utils/common')
const { UnstakeSetupCfgSettings, checkBalances, getSDKOptions, submitTransactionCheck, selectDelay } = require('../../../utils/script_helpers')
const { logsHelper } = require('../../../utils/logsHelper')
const {
    setupFromAmountVAalue,
    setupTxPayload,
    setupTortugaStake
} = require('./utils/helpers')

async function mainUnStakeFunction(pontemKey, logger, addressIndex,module_name){
    const moduleString = `[Account ${addressIndex}][${module_name}][UnStake]`
    const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)
    let stAptBalance = await checkBalances(address, coinClient, client, `${module_name}_StAPT`)
    const [delay_txns,unstake_instantly] = await UnstakeSetupCfgSettings(module_name)
    let txPayload, fromAmountFormatted, toAmountFormatted

    if ( module_name === 'TortugaStake'){
        txPayload = await setupTortugaStake(stAptBalance,unstake_instantly,logger,addressIndex,0)
    } else if ( module_name === 'DittoStake'){
        [fromAmountFormatted,toAmountFormatted] = await setupFromAmountVAalue(stAptBalance, logger, addressIndex, 0,module_name)
        txPayload = await setupTxPayload(module_name,stAptBalance)
        logger.info(`${moduleString} - Stake ${fromAmountFormatted} stAPT | Get ${toAmountFormatted} APT`)
        
    }

    const [flag,hash] = await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
        if (flag){
            const logs = new logsHelper(address, 'APT', undefined, stAptBalance, `https://explorer.aptoslabs.com/txn/${hash}`, module_name,'UnstakeAPT',1);
            logs.log_to_excel()
            .then(() => logger.info(`${moduleString} - Data logged successfully`))
            .catch((error) => logger.info('Error via logs:', error));
        }
    await selectDelay(delay_txns)

    

}

module.exports  = {
    mainUnStakeFunction
}