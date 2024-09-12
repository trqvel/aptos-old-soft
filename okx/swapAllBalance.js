const { AptoswapClient } = require("@vividnetwork/swap-sdk");
const { AptosClient, CoinClient } = require("aptos")
const { NODE_URL, TokensMapping, APTOSWAP_URL,Contracts } = require("../utils/common");
const { logsHelper } = require('../utils/logsHelper')
const {
    getSDKOptions,
    getCfgSettingsSwap,
    setupBalanceValue,
    setupTokensForFullSwap,
    setupFromAmountVAalue,
    submitTransactionCheck,
    setupDelayFunc,
    checkBalances,
} = require("../utils/script_helpers");

const{
    calculateMinToAmount,
    selectPoolForSwap
} = require("../utils/aptoswap_helpers")

const {
    setupTxPayload
} = require('../modules/main_modules/swap/utils/helpers')
const { TokenNames } = require("../utils/common");

async function mainSwapFunction(pontemKey, logger, addressIndex,module_name,src,dst) {
    const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)
    const swap_all_balance = true
    const amountPercent = 100
    const delay = [5,5]
    logger.info(`[Account ${addressIndex}][${module_name}][Swap] - Swap All balance to APT `);

    const { pools } = await aptoswapClient.getCoinsAndPools();
    const slippage = 0.005;
    const moduleString = `[Account ${addressIndex}][${module_name}][Swap][Transaction]`
    // let [aptBalance,usdcBalance,usdtBalance] = await setupBalanceValue(address,coinClient,client)
    // let [availableTokens, fromToken, src, dst] = await setupTokensForFullSwap(swap_all_balance,aptBalance,usdcBalance,usdtBalance)
    const availableTokens = [TokensMapping[src],TokensMapping[dst]]
    logger.info(`${moduleString} - Selected tokens: from ${src} to ${dst} `)
    const fromToken = TokensMapping[src]
    const toToken = TokensMapping[dst]
    const fromBalance = await checkBalances(address,coinClient,client,src)
    const [fromAmountPercentage, fromAmountValue, fromAmountFormatted] = await setupFromAmountVAalue(availableTokens,fromToken,fromToken,fromBalance,amountPercent,client,logger, addressIndex, 0,swap_all_balance)
    
    logger.info(`${moduleString} - Selected Percent Amount: ${fromAmountPercentage}`);

    const [pool, direction] = await selectPoolForSwap(pools, src, dst, TokensMapping, logger, addressIndex, 0);

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


module.exports = {
    mainSwapFunction
}