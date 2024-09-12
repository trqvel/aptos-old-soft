const { AptoswapClient } = require("@vividnetwork/swap-sdk");
const { AptosClient, CoinClient } = require("aptos")
const { NODE_URL, TokensMapping, APTOSWAP_URL,Contracts } = require("../../../utils/common");
const { logsHelper } = require('../../../utils/logsHelper')
const {
    getSDKOptions,
    getCfgSettingsSwap,
    setupBalanceValue,
    setupTokensForFullSwap,
    setupFromAmountVAalue,
    submitTransactionCheck,
    setupDelayFunc,
} = require("../../../utils/script_helpers");

const{
    calculateMinToAmount,
    selectPoolForSwap
} = require("../../../utils/aptoswap_helpers")

const {
    setupTxPayload
} = require('./utils/helpers')

async function mainSwapFunction(pontemKey, logger, addressIndex,module_name) {
    const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)
    const [swap_all_balance,amountPercent,transactionsCount,delay] = await getCfgSettingsSwap(module_name)

    logger.info(`[Account ${addressIndex}][${module_name}][Swap] - Transaction count: ${transactionsCount} `);

    const { pools } = await aptoswapClient.getCoinsAndPools();
    const slippage = 0.005;

    for (let i = 0; i < transactionsCount; i++) {

        const moduleString = `[Account ${addressIndex}][${module_name}][Swap][Transaction №${i+1}]`
        let [aptBalance,usdcBalance,usdtBalance] = await setupBalanceValue(address,coinClient,client,logger,addressIndex)
        let [availableTokens, fromToken, src, dst] = await setupTokensForFullSwap(swap_all_balance,aptBalance,usdcBalance,usdtBalance)
        
        logger.info(`${moduleString} - Selected tokens: from ${src} to ${dst} `)

        const toToken = TokensMapping[dst]
        const fromBalance = availableTokens.find(token => token.token === fromToken).balance;
        const [fromAmountPercentage, fromAmountValue, fromAmountFormatted] = await setupFromAmountVAalue(availableTokens,fromToken,fromToken,fromBalance,amountPercent,client,logger, addressIndex, i,swap_all_balance)
        
        logger.info(`${moduleString} - Selected Percent Amount: ${fromAmountPercentage}`);

        const [pool, direction] = await selectPoolForSwap(pools, src, dst, TokensMapping, logger, addressIndex, i);

        let [toAmountValue, toAmountFormatted] = await calculateMinToAmount(src, dst, pool, fromAmountValue, slippage);
        const txPayload = await setupTxPayload(fromToken, toToken, fromAmountValue, toAmountValue, module_name,account);
        
        
        logger.info(`${moduleString} - Swap from ${src} to ${dst} | Get ${toAmountFormatted} ${dst} for ${fromAmountFormatted} ${src}`)
        const [flag,hash] = await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
        if (flag){
            const logs = new logsHelper(address, src, dst, fromAmountValue, `https://explorer.aptoslabs.com/txn/${hash}`, module_name,'SWAP',1);
            logs.log_to_excel()
            .then(() => logger.info(`${moduleString} - Data logged successfully`))
            .catch((error) => logger.info('Error via logs:', error));
        }
        await setupDelayFunc(delay,moduleString,logger)
        
    }
}


module.exports = {
    mainSwapFunction
}