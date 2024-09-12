const { TokensMapping,Contracts } = require('../../../../utils/common')

async function setupArgumentsCertusCfg(module_name,fromAmountValue,toAmountValue,fromToken,toToken){
    let str, toTokenSpecial, bool1, lastStr;

    if (fromToken === TokensMapping.USDT || toToken === TokensMapping.USDT) {
      str = Contracts.CERTUS_SWAP_BIGSTR_USDT;
      toTokenSpecial = TokensMapping.USDT;
    } else if (fromToken === TokensMapping.USDC || toToken === TokensMapping.USDC) {
      str = Contracts.CERTUS_SWAP_BIGSTR_USDC;
      toTokenSpecial = TokensMapping.USDC;
    }
  
    if (fromToken === TokensMapping.APT) {
      lastStr = Contracts.CERTUS_SWAP_FROM_APT_TO_STABLE_STR;
      bool1 = true;
    } else if (fromToken === TokensMapping.USDC || fromToken === TokensMapping.USDT) {
      lastStr = Contracts.CERTUS_SWAP_FROM_STABLE_TO_APT_STR;
      bool1 = false;
    }
    
    return [str, bool1, true, Number(fromAmountValue), Number(toAmountValue), lastStr, ""];
}

// async function setupArgumentsAptoSwapCfg(){

  
// }

async function setupArgumentsHoustonCfg(module_name,fromAmountValue,toAmountValue,fromToken, toToken,account){
    let sinwluxi;
    if (toToken === TokensMapping.USDC || toToken === TokensMapping.USDT) {
        sinwluxi = 68944469102655171393967;
    } else
        sinwluxi = 68949220127244732;

    const _1 = Date.now();
    const date = new Date(_1);
    date.setDate(date.getDate() + 19);
    date.setHours(date.getHours() + 13);
    date.setMinutes(date.getMinutes() + 10);
    date.setSeconds(date.getSeconds());

    const timestamp = date.getTime()

    return [fromAmountValue,
        BigInt(sinwluxi),
        '0',
        timestamp,
        account.address(),
        toAmountValue]

}

module.exports = {setupArgumentsCertusCfg,setupArgumentsHoustonCfg}