const { Final, TokensMapping, ModulesMapping } = require("../../../../utils/common");

async function setupTortugaStake(stAptBalance,instantly,logger,accountIndex,i){

    const src = "tAPT"
    const dst = "APT"
    const exRate_INS = 1.03155;
    const exRate_1M = 1.049997;
    let toAmount, ThomasiIsPidor, type_args, args, toAmountFormatted, fromAmountFormatted;

    if (instantly) {
        toAmount = Number(stAptBalance) * exRate_INS;
        toAmountFormatted = toAmount / 10 ** 8
        fromAmountFormatted = stAptBalance / 10 ** 8;
        ThomasiIsPidor = Final.TortugaStake_INSTANTLY;
        type_args = [TokensMapping.tAPT, TokensMapping.APT];
        args = [(stAptBalance), 0];
        logger.info(`[Account ${accountIndex}][Tortuga][Unstake][Transaction №${i+1}] - Unstake ${fromAmountFormatted} ${src} | Get ~${toAmountFormatted} ${dst}`);
    } else {
        toAmount = Number(stAptBalance) * exRate_1M;
        toAmountFormatted = toAmount / 10 ** 8
        fromAmountFormatted = stAptBalance / 10 ** 8;
        ThomasiIsPidor = Final.TortugaStake_1M;
        type_args = [];
        args = [(stAptBalance)];
        logger.info(`[Account ${accountIndex}][Tortuga][Unstake][Transaction №${i+1}] - Unstake ${fromAmountFormatted} ${src} | Get ~${toAmountFormatted} ${dst} in ~1 Month`);
    }

    const txPayload = {
        function: ThomasiIsPidor,
        type_arguments: type_args,
        arguments: args,
        type: "entry_function_payload",
    };

    return txPayload

}

async function setupFunction(module_name,contractName){
    let contractFunction;
    if (module_name === 'AptoSwap') {
        ({ [contractName]: contractFunction } = Final);
    } else {
        ({ [contractName]: contractFunction } = Final);
    }
    return contractFunction;
}

async function setupFromAmountVAalue( stAptBalance, logger, accountIndex, i,module_name){
    let exRate
    if (module_name === 'DittoStake'){
         exRate = 1.03582967
    } else if (module_name === 'TortugaStake') {
         exRate = 0.952383
    }
    
    const toAmount = Number(stAptBalance) * exRate;
    const toAmountFormatted = toAmount / 10 ** 8
    const fromAmountFormatted = stAptBalance / 10 ** 8;

    return [fromAmountFormatted,toAmountFormatted]
}

async function setupTxPayload(module_name,fromAmountValue){
    const contractName = `${module_name}_UNSTAKE`
    const contractFunction = await setupFunction(module_name,contractName)

    const txPayload = { 
        "function": contractFunction,
        "type_arguments":[],
        "arguments":[(fromAmountValue)],
        "type":"entry_function_payload"
        
    };
    return txPayload

}

module.exports = {
    setupFromAmountVAalue,
    setupTxPayload,
    setupTortugaStake
}