const { TokensMapping,Final } = require('../../../../utils/common')

async function  setupTypeArgumentsForModuleCertusCfg(module_name, fromToken, toToken){
    let fromTokenNew,toTokenNew

    fromTokenNew = TokensMapping.APT
    if (fromToken === TokensMapping.USDC || toToken == TokensMapping.USDC) {toTokenNew = TokensMapping.USDC}
    if (fromToken === TokensMapping.USDT || toToken == TokensMapping.USDT) {toTokenNew = TokensMapping.USDT}

    return [fromTokenNew,toTokenNew]

}

async function setupTypeArgumentsForAptosSwapCfg(module_name, fromToken, toToken) {
    let fromTokenNew,toTokenNew

    if (fromToken === TokensMapping.USDC || toToken == TokensMapping.USDC) {toTokenNew = TokensMapping.USDC}
    if (fromToken === TokensMapping.USDT || toToken == TokensMapping.USDT) {toTokenNew = TokensMapping.USDT}
    
    return [TokensMapping.APT,toTokenNew]
}

async function setupTypeArgumentsForModuleLiquidSwapCfg(module_name, fromToken, toToken) {
    
    const NewParam = Final.LiquidSwap_NEW_PARAM
    return [fromToken,toToken,NewParam]
}

module.exports = {setupTypeArgumentsForModuleCertusCfg,setupTypeArgumentsForAptosSwapCfg,setupTypeArgumentsForModuleLiquidSwapCfg}