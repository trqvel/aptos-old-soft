const { setupArgumentsAnimeSwap } = require("../../burnLP/utils/arguments");
const { TokensMapping,Final } = require("../../../../utils/common");

async function setupFunction(module_name,contractName){
    
    let contractFunction;
    if (module_name === 'AptoSwap') {
        ({ [contractName]: contractFunction } = Final);
    } else {
        ({ [contractName]: contractFunction } = Final);
    }
    return contractFunction;
    
}

async function setupArguments(module_name,fromAmountValue,toAmountVal){
    if ( module_name === 'AnimeSwap'){
        return await setupArgumentsAnimeSwap(fromAmountValue,toAmountVal)
    } else if ( module_name === 'AuxSwap'){
        return [fromAmountValue]
    } else if ( module_name === 'PancakeSwap'){
        return await setupArgumentsAnimeSwap(fromAmountValue,toAmountVal)
    } else if ( module_name === 'AptoSwap'){
        return [fromAmountValue]
    } else if ( module_name === 'ObricSwap'){
        return [fromAmountValue]
    }


}

async function setupTypeArguments(module_name,src,dst){
    if ( module_name === 'AnimeSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'AuxSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'PancakeSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'AptoSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'ObricSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    }

}

async function setupTxPayload(fromToken, toToken,pool,balance,toAmountVal,module_name){

    const contractName = `${module_name}_BURN_LP`
    const contractFunction = await setupFunction(module_name,contractName)
    const Arguments = await setupArguments(module_name,balance,toAmountVal)
    const typeArguments = await setupTypeArguments(module_name,fromToken,toToken)
    
    const txPayload = { 
        "function": contractFunction,
        "type_arguments":typeArguments,
        "arguments":Arguments,
        "type":"entry_function_payload"
        
    };
    return txPayload
}

module.exports = {setupTxPayload}