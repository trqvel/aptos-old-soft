const {AptosClient, CoinClient} = require("aptos");
const {NODE_URL, TokensMapping,APTOSWAP_URL} = require("../../../utils/common");
const { logsHelper } = require('../../../utils/logsHelper')

const {
    checkBalances,
    selectDelay,
    getSDKOptions,
    setupCfgSettings,
    submitTransactionCheck
} = require("../../../utils/script_helpers");

const {
    setupFromAmountVAalue, setupTxPayload
} = require('./utils/helpers')

async function mainStakeFunction(pontemKey, logger, addressIndex,module_name){

    const moduleString = `[Account ${addressIndex}][${module_name}][Stake]`
    const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)

    let aptBalance = await checkBalances(address, coinClient, client, 'APT')
    const [balancePercent, delay_txns] = await setupCfgSettings(module_name)
    const [fromAmountPercentage, fromAmountValue, fromAmountFormatted,toAmount] = await setupFromAmountVAalue(TokensMapping['APT'],aptBalance,balancePercent,false, client, logger, addressIndex, 0,module_name)
    logger.info(`${moduleString} - Selected Percent Amount: ${fromAmountPercentage}`)

    const txPayload = await setupTxPayload(module_name,fromAmountValue)
    logger.info(`${moduleString} - Stake ${fromAmountFormatted} APT | Get ${toAmount} stAPT`)
    const [flag,hash] = await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
        if (flag){
            const logs = new logsHelper(address, 'APT', undefined, fromAmountValue, `https://explorer.aptoslabs.com/txn/${hash}`, module_name,'StakeAPT',1);
            logs.log_to_excel()
            .then(() => logger.info(`${moduleString} - Data logged successfully`))
            .catch((error) => logger.info('Error via logs:', error));
        }
    await selectDelay(delay_txns)
}

module.exports = {
    mainStakeFunction
}