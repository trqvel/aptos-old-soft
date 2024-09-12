const { NODE_URL, TokensMapping, APTOSWAP_URL,Contracts } = require('../../../utils/common');

const{
    calculateMinToAmount,
    selectPoolForSwap,
    calculateToAmount
} = require("../../../utils/aptoswap_helpers")

const {
    setupTxPayload
} = require('./utils/helpers')

const {
    submitTransactionCheck,
    setupDelayFunc
} = require("../../../utils/script_helpers");


async function usdcHelperSwap(pool,pools,src,dst,fromAmountValue,toAmountValue,usdcBalance,moduleString,logger){
    
    pool = pools.filter(p => p.type.xTokenType.name === TokensMapping.APT && p.type.yTokenType.name === TokensMapping.USDC)[0];
    fromAmountValue = 100000000;
    let slippage = 0;

    let [tempToAmount, _1] = await calculateToAmount(src, dst, pool, fromAmountValue, slippage);

    rate = (Number(tempToAmount) / Number(fromAmountValue));

    let toAmounteVal = Number(toAmountValue) - Number(usdcBalance);
    logger.info(`${moduleString} - Starting swap ${src} to get ${Number(toAmounteVal) / 10 ** 6} ${dst}`)
    fromAmountValue = BigInt(Math.round(Number(toAmounteVal) / Number(rate)));

    slippage = 0.005;

    const [toAmountVal, _2] = await calculateMinToAmount(src, dst, pool, fromAmountValue, slippage);
    return [fromAmountValue,toAmountVal]

}

async function usdtHelperSwap(pool,pools,src,dst,fromAmountValue,toAmountValue,usdtBalance,moduleString,logger){

    pool = pools.filter(p => p.type.xTokenType.name === TokensMapping.APT && p.type.yTokenType.name === TokensMapping.USDT)[0];
    fromAmountValue = 100000000;
    let slippage = 0;

    let  [tempToAmount, _1] = await calculateToAmount(src, dst, pool, fromAmountValue, slippage);

    let rate = (Number(tempToAmount) / Number(fromAmountValue));

    let toAmounteVal = Number(toAmountValue) - Number(usdtBalance);
    logger.info(`${moduleString} - Starting swap ${src} to get ${Number(toAmounteVal) / 10 ** 6} ${dst}`)
    fromAmountValue = BigInt(Math.round(Number(toAmounteVal) / Number(rate)));

    slippage = 0.005;

    const [toAmountVal, _2] = await calculateMinToAmount(src, dst, pool, fromAmountValue, slippage);
    return [fromAmountValue,toAmountVal]

}
async function makeTransaction(addressIndex,module_name,src,dst,fromAmountValueTemp,toAmountValueTemp,account,address,client,logger,delay_txns){
    if (module_name === 'ObricSwap'){ module_name = 'PancakeSwap'}
    let moduleString = `[Account ${addressIndex}][${module_name}][Swap]`;
    fromAmountValueTemp = BigInt(fromAmountValueTemp) + (BigInt(fromAmountValueTemp) * BigInt(95) / BigInt(100));
    toAmountValueTemp = BigInt(toAmountValueTemp) + (BigInt(toAmountValueTemp) * BigInt(95) / BigInt(100));
    const txPayload = await setupTxPayload(TokensMapping[src], TokensMapping[dst], fromAmountValueTemp, toAmountValueTemp, module_name, account);await submitTransactionCheck(account,address,client,logger,addressIndex,txPayload,moduleString)
    await setupDelayFunc(delay_txns,moduleString,logger)

}
async function helperSwap (src,dst,usdcBalance,usdtBalance,toAmountValue,logger,moduleString,toAmountFormatted,pool,pools,fromAmountValue,module_name,account,address,client,addressIndex,delay_txns){
    let fromAmountValueTemp,toAmountValueTemp

    if (dst === "USDC" && usdcBalance < toAmountValue){
        logger.info(`${moduleString} - Not enough ${toAmountFormatted} ${dst} to add`);
        [fromAmountValueTemp,toAmountValueTemp] = await usdcHelperSwap(pool,pools,src,dst,fromAmountValue,toAmountValue,usdcBalance,moduleString,logger)
        await makeTransaction(addressIndex,module_name,src,dst,fromAmountValueTemp,toAmountValueTemp,account,address,client,logger,delay_txns)
    }

    if (dst === "USDT" && usdtBalance < toAmountValue){
        logger.info(`${moduleString} - Not enough ${toAmountFormatted} ${dst} to add`);
        [fromAmountValueTemp,toAmountValueTemp] = await usdtHelperSwap(pool,pools,src,dst,fromAmountValue,toAmountValue,usdtBalance,moduleString,logger)
        await makeTransaction(addressIndex,module_name,src,dst,fromAmountValueTemp,toAmountValueTemp,account,address,client,logger,delay_txns)
    }
    
   
}

module.exports = {helperSwap}