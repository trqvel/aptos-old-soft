const{ checkBalances } = require('../../../../utils/script_helpers')
const { Final,TokensMapping } = require('../../../../utils/common')

const {
    calculateToAmountPool,
} = require("../../../../utils/aptoswap_helpers");

const {
    
} = require('./type_arguments')

const {
    setupArgumentsPancakeSwap,
    setupArgumentsAnimeSwap,
    setupArgumentsLiquidSwap,
    setupArgumentsCertus
} = require('./arguments')

async function setupFunction(module_name, contractName, fromToken) {
    let contractFunction;
    if (module_name === 'AptoSwap') {
        ({ [contractName]: contractFunction } = Final);
    } else {
        ({ [contractName]: contractFunction } = Final);
    }
    return contractFunction;
}

async function setupArguments(module_name,src,dst,pool,fromAmountValue,toAmountValue){
    if (module_name === 'PancakeSwap' ){ 
        return await setupArgumentsPancakeSwap(src, dst, pool,fromAmountValue,toAmountValue)
    } else if ( module_name === 'AuxSwap'){
        return [fromAmountValue,toAmountValue,'50']
    } else if ( module_name === 'AnimeSwap'){
        return await setupArgumentsAnimeSwap(src, dst, pool,fromAmountValue,toAmountValue)
    } else if ( module_name === 'AptoSwap'){
        return [fromAmountValue,toAmountValue]
    } else if ( module_name === 'ObricSwap'){
        return [fromAmountValue,toAmountValue]
    } else if ( module_name === 'LiquidSwap'){
        return await setupArgumentsLiquidSwap(src, dst, pool,fromAmountValue,toAmountValue)
    } else if ( module_name === 'Certus'){
        return await setupArgumentsCertus(src,dst,fromAmountValue, toAmountValue,pool)
    }

}

async function setupTypeArguments(module_name,src,dst,pool,fromAmountValue,toAmountValue){

    if (module_name === 'PancakeSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'AuxSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'AnimeSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'AptoSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'ObricSwap'){
        return [TokensMapping[src],TokensMapping[dst]]
    } else if ( module_name === 'LiquidSwap'){
        return [TokensMapping[dst],TokensMapping[src],Final.LiquidSwap_NEW_PARAM]
    } else if ( module_name === 'Certus'){
        return [TokensMapping[src],TokensMapping[dst]]
    }

}

async function setupTxPayload(src,dst,fromAmountValue,toAmountValue,module_name,pool){

    const contractName = `${module_name}_ADD_LP`
    const contractFunction = await setupFunction(module_name,contractName)
    const Arguments = await setupArguments(module_name,src, dst, pool,fromAmountValue,toAmountValue)
    const typeArguments = await setupTypeArguments(module_name,src,dst,pool,fromAmountValue,toAmountValue)
    
    const txPayload = { 
        "arguments":Arguments,
        "function": contractFunction,
        "type":"entry_function_payload",
        "type_arguments":typeArguments,
    };
    return txPayload
}

async function setupScrDstBalance(address,coinClient,client,src,dst,logger,addressIndex,module_name){
    let srcBalance, dstBalance
        try {
            srcBalance = await checkBalances(address, coinClient, client, src);
            dstBalance = await checkBalances(address, coinClient, client, dst);
            
        } catch (error) {
            logger.error(`[Account ${addressIndex}][${module_name}][LP][Add] - An error occurred while checking balances - ${error.message}`)
            return;
        }
    srcBalance = BigInt(srcBalance) -  (BigInt(srcBalance) * BigInt(2)/BigInt(100))
    dstBalance = BigInt(dstBalance) -  (BigInt(dstBalance) * BigInt(2)/BigInt(100))
    return [srcBalance, dstBalance]

}

module.exports = {
    setupScrDstBalance,
    setupTxPayload
}