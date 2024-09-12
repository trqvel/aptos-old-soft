const {
    calculateToAmountPool,
} = require("../../../../utils/aptoswap_helpers");
const { Final } = require("../../../../utils/common");

async function setupArgumentsPancakeSwap(src,dst,pool,fromAmountValue,toAmountVal){
    const fromAmountValueSlipp = BigInt(fromAmountValue) - (BigInt(fromAmountValue) * BigInt(5)/BigInt(100));
    const [toAmountValueWithoutSlipp, _] = await calculateToAmountPool(src, dst, pool, fromAmountValueSlipp, 0);

    return [fromAmountValue,toAmountVal,fromAmountValueSlipp,toAmountValueWithoutSlipp]
}

async function setupArgumentsAnimeSwap(src,dst,pool,fromAmountValue,toAmountVal){
    const fromAmountValueSlipp = BigInt(fromAmountValue) - (BigInt(fromAmountValue) * BigInt(5)/BigInt(100));
    const [toAmountValueWithoutSlipp, _] = await calculateToAmountPool(src, dst, pool, fromAmountValueSlipp, 0);

    return [fromAmountValue,toAmountVal,fromAmountValueSlipp,toAmountValueWithoutSlipp]


}

async function setupArgumentsLiquidSwap(src,dst,pool,fromAmountValue,toAmountVal){
    const fromAmountValueSlipp = BigInt(fromAmountValue) - (BigInt(fromAmountValue) * BigInt(5)/BigInt(100));
    const [toAmountValueWithoutSlipp, _] = await calculateToAmountPool(src, dst, pool, fromAmountValueSlipp, 0);

    return [toAmountVal,toAmountValueWithoutSlipp,fromAmountValue,fromAmountValueSlipp]

}

async function setupArgumentsCertus(src,dst,fromAmountValue, toAmountVal,pool){
    const fromAmountValueSlipp = BigInt(fromAmountValue) - (BigInt(fromAmountValue) * BigInt(5)/BigInt(100));
    const [toAmountValueWithoutSlipp, _] = await calculateToAmountPool(src, dst, pool, fromAmountValueSlipp, 0);

    let str,tokenStr
    if(dst === 'USDC'){
        str = Final.CERTUS_SWAP_BIGSTR_USDC
        tokenStr = Final.CERTUS_ADD_LP_STR_USDC
    }

    if (dst === 'USDT'){
        str = Final.CERTUS_SWAP_BIGSTR_USDT
        tokenStr = Final.CERTUS_ADD_LP_STR_USDT
    }

    return [str,fromAmountValue,toAmountValueWithoutSlipp,false,'18446744073709516336',tokenStr,true,0]
    
}

module.exports = {
    setupArgumentsPancakeSwap,
    setupArgumentsAnimeSwap,
    setupArgumentsLiquidSwap,
    setupArgumentsCertus
}