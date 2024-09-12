const { TokensMapping } = require("../../../../utils/common");
const {
    selectPoolForSwap,
    calculateMinToAmount
} = require('../../../../utils/aptoswap_helpers')

async function performBurnOperation(fromToken, toToken, balance, accountIndex, logger, sdk, client, address, account, aptoswapClient, slippage,module_name){

        const i = 0
        const { pools } = await aptoswapClient.getCoinsAndPools();
        const [pool, direction] = await selectPoolForSwap(pools, fromToken, toToken, TokensMapping, logger, accountIndex, i);
        const [toAmountVal, toAmountValFormatted] = await calculateMinToAmount(fromToken, toToken, pool, balance, slippage);
        const balanceWithSlipp = BigInt(balance) - (BigInt(balance) * BigInt(5)/BigInt(100))
        return [fromToken, toToken,pool,balance,toAmountVal]
}



module.exports = {
    performBurnOperation
}