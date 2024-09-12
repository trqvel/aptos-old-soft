const { Final } = require("../../../../utils/common");
const { calculateFromAmount } = require("../../../../utils/script_helpers")

async function setupFunction(module_name,contractName){
    let contractFunction;
    if (module_name === 'AptoSwap') {
        ({ [contractName]: contractFunction } = Final);
    } else {
        ({ [contractName]: contractFunction } = Final);
    }
    return contractFunction;
}

async function setupFromAmountVAalue(fromToken, fromBalance, amountPercent, swapAllBalance, client, logger, accountIndex, i,module_name){
    let exRate
    if (module_name === 'DittoStake'){
         exRate = 1.03582967
    } else if (module_name === 'TortugaStake') {
         exRate = 0.952383
    }
    
    const [fromAmountPercentage, fromAmountValue, fromAmountFormatted] = await calculateFromAmount(fromToken, fromBalance, amountPercent, swapAllBalance, client, logger, accountIndex, i)
    const toAmount = fromAmountFormatted / exRate
    return [fromAmountPercentage, fromAmountValue, fromAmountFormatted,toAmount]
}

async function setupTxPayload(module_name,fromAmountValue){
    const contractName = `${module_name}_STAKE`
    const contractFunction = await setupFunction(module_name,contractName)

    const txPayload = { 
        "function": contractFunction,
        "type_arguments":[],
        "arguments":[BigInt(fromAmountValue)],
        "type":"entry_function_payload"
        
    };
    return txPayload

}

module.exports = {
    setupFromAmountVAalue,
    setupTxPayload
}