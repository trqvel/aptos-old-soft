const { Final, TokensMapping } = require("../../../../utils/common");
const {
    setupArgumentsCertusCfg,
    setupArgumentsHoustonCfg,
    setupArgumentsAptoSwapCfg
} = require('./setupArg')

const {
    setupTypeArgumentsForModuleCertusCfg,
    setupTypeArgumentsForAptosSwapCfg,
    setupTypeArgumentsForModuleLiquidSwapCfg

} = require('./setupTypeArg')

async function setupTypeArguments(module_name, fromToken, toToken) {
    if (module_name === 'AptoSwap') {
        return await setupTypeArgumentsForAptosSwapCfg(module_name, fromToken, toToken);
    } else if (module_name === 'LiquidSwap') {
        return await setupTypeArgumentsForModuleLiquidSwapCfg(module_name, fromToken, toToken);
    } else if (module_name === 'Certus') {
        return await setupTypeArgumentsForModuleCertusCfg(module_name, fromToken, toToken);
    }
    else{
        return [fromToken,toToken]
    }
}

async function setupArguments(module_name,fromAmountValue,toAmountValue,fromToken, toToken,account){
    if (module_name === 'Certus'){
        return await setupArgumentsCertusCfg(module_name,fromAmountValue,toAmountValue,fromToken, toToken)
    }
    else if ( module_name === 'Houston'){
        return await setupArgumentsHoustonCfg(module_name,fromAmountValue,toAmountValue,fromToken, toToken,account)
    // }else if ( module_name === 'AptoSwap'){
    //     return await setupArgumentsAptoSwapCfg()
    } else {
        return [Number(fromAmountValue),Number(toAmountValue)]
    }
}

async function setupFunction(module_name, contractName, fromToken) {
    let contractFunction;
    if (module_name === 'AptoSwap') {
        if (fromToken === TokensMapping.APT) {
            contractFunction = '0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::swap_x_to_y';
        } else {
            contractFunction = '0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::swap_y_to_x';
        }
    } else {
        ({ [contractName]: contractFunction } = Final);
    }
    return contractFunction;
}


async function setupTxPayload(fromToken, toToken, fromAmountValue, toAmountValue, module_name,account){
    const contractName = `${module_name}_SWAP`
    const contractFunction = await setupFunction(module_name,contractName,fromToken)
    const typeArguments = await setupTypeArguments(module_name, fromToken, toToken)
    const Arguments = await setupArguments(module_name,fromAmountValue,toAmountValue,fromToken, toToken,account)
    const txPayload = {
        function: contractFunction,
        type_arguments: typeArguments,
        arguments: Arguments,
        type: "entry_function_payload",
    };

    return txPayload
}

module.exports = {setupTxPayload}