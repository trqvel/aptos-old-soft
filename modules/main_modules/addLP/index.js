const { AptoswapClient } = require("@vividnetwork/swap-sdk");
const { AptosClient, CoinClient } = require("aptos")
const { NODE_URL, TokensMapping, APTOSWAP_URL,Contracts } = require("../../../utils/common");
const { logsHelper } = require('../../../utils/logsHelper')
const {
    getSDKOptions,
    getCfgSettingsAddLP,
    setupBalanceValue,
    setupTokensForFullSwap,
    setupFromAmountVAalue,
    submitTransactionCheck,
    setupDelayFunc,
    calculateFromAmount,
    getRandomPair

} = require("../../../utils/script_helpers");

const{
    calculateMinToAmount,
    selectPoolForSwap,
    calculateToAmountPool
} = require("../../../utils/aptoswap_helpers")

const {
    setupScrDstBalance,
} = require('./utils/helpers')

const {
    helperSwap
} = require('../swap/helpersSwap');
const { setupTxPayload } = require("../addLP/utils/helpers");
const {LiquidSwap_addLP} = require('./utils/liquidswap/addLP')
async function mainAddLPFunction(pontemKey, logger, addressIndex,module_name){

    const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)
    const [pools_for_add_lp,balancePercent,delay_txns] = await getCfgSettingsAddLP(module_name)


    let slippage = 0.005;
    const { pools } = await aptoswapClient.getCoinsAndPools();

    const len = pools_for_add_lp.length
    logger.info(`[Account ${addressIndex}][${module_name}][AddLP] - Было выбрано ${len} пула ликвидности `);

    for (let i = 0; i < len; i++){
        if (module_name === 'LiquidSwap'){
            let src, dst;
            [src, dst] = await getRandomPair(pools_for_add_lp);
            await LiquidSwap_addLP(pontemKey, addressIndex, logger,i,src,dst)
        }else {
            let src, dst;
            let moduleString = `[Account ${addressIndex}][${module_name}][AddLP][Pool №${i + 1}]`;
            [src, dst] = await getRandomPair(pools_for_add_lp);
            logger.info(`${moduleString} - Selected Pool: Pair ${src}/${dst}`)
            let [aptBalance,usdcBalance,usdtBalance] = await setupBalanceValue(address, coinClient, client,logger,addressIndex)
            let [srcBalance, dstBalance] = await setupScrDstBalance(address,coinClient,client,src,dst,logger,addressIndex,module_name)
            const [fromAmountPercentage, fromAmountValue, fromAmountFormatted] = await calculateFromAmount(TokensMapping[src], srcBalance, balancePercent, false, client, logger, addressIndex, i);
            logger.info(`${moduleString} - Selected Percent Amount: ${fromAmountPercentage}`);
            let [pool, direction] = await selectPoolForSwap(pools, src, dst, TokensMapping, logger, addressIndex, i);
            const [toAmountValue, toAmountFormatted] = await calculateToAmountPool(src, dst, pool, fromAmountValue, slippage);
            logger.info(`${moduleString}  - Pair ${src}/${dst} | Add ${fromAmountFormatted} ${src} to LP`)
            if (usdcBalance < toAmountValue || usdtBalance < toAmountValue ){ await helperSwap(src,dst,usdcBalance,usdtBalance,toAmountValue,logger,moduleString,toAmountFormatted,pool,pools,fromAmountValue,module_name,account,address,client,addressIndex,delay_txns)}
            const txPayload = await setupTxPayload(src,dst,fromAmountValue,toAmountValue,module_name,pool)
            const [flag,hash] = await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
            if (flag){
                const logs = new logsHelper(address, src, dst, fromAmountValue, `https://explorer.aptoslabs.com/txn/${hash}`, module_name,'AddLP',1);
                logs.log_to_excel()
                    .then(() => logger.info(`${moduleString} - Data logged successfully`))
                    .catch((error) => logger.info('Error via logs:', error));
            }
            await setupDelayFunc(delay_txns,moduleString,logger)}
    }

}
module.exports = {mainAddLPFunction}