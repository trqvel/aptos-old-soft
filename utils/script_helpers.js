const {AptosAccount} = require("aptos");
const {TokensMapping, TokenNames, ModulesMapping} = require("./common");
const {Web3} = require("web3")
const { AptoswapClient } = require("@vividnetwork/swap-sdk");
const { AptosClient, CoinClient } = require("aptos")
const { NODE_URL, APTOSWAP_URL, Contracts,Final } = require("../utils/common");
// const {DEFAULT_MAX_GAS_AMOUNT} = require('../node_modules/aptos/src/utils/misc.ts')
// const {
//     getAptosAccount,
//     waitUntilTransactionProcessed,
//     getGasPrice,
//     selectDelay,
//     checkBalances
// } = require("../utils/script_helpers");

const {AptoSwap,
    PancakeSwap,
    AnimeSwap,
    AuxSwap,
    ObricSwap,
    BlueMove,
    Souffl3,
    Topaz,
    General,
    Certus,
    Houston,
    DittoStake,
    TortugaStake,}  = require('../config')

async function getAptosAccount(privateKey) {
    const privateKeyBytes = Buffer.from(privateKey.replace('0x', ''), 'hex');
    return new AptosAccount(privateKeyBytes);
}

async function setupAddLPBalance(address, coinClient, client,module_name){
    let lpaptusdcbalance,lpaptusdtbalance 
    const lpaptusdcbalanceString = `${module_name}_LPAPTUSDC`
    const lpaptusdtbalanceString = `${module_name}_LPAPTUSDT`
    lpaptusdcbalance = await checkBalances(address, coinClient, client,lpaptusdcbalanceString) 
    lpaptusdtbalance = await checkBalances(address, coinClient, client,lpaptusdtbalanceString)

    return [lpaptusdcbalance,lpaptusdtbalance]

}

async function setupCfgSettings(module_name){
    const { delay_txns, balancePercent } = require("../config")[module_name];
    return [delay_txns,balancePercent]
}

async function UnstakeSetupCfgSettings(module_name){
    const { delay_txns,unstake_instantly } = require("../config")[module_name];
    return [delay_txns,unstake_instantly]
}

async function getRandomPair(pools) {

    try{
        const randomIndex = Math.floor(Math.random() * pools.length);
        const selectedPair = pools[randomIndex];
        const [src, dst] = selectedPair.split('/');
        pools.splice(randomIndex, 1);
        return [src,dst]
    }catch (error) {
        console.log(ошибка)
        console.log(error)
        await getRandomPair(pools)
    }

}

async function getSDKOptions(APTOSWAP_URL,NODE_URL,aptos_key){
    const aptoswapClient = await AptoswapClient.fromHost(APTOSWAP_URL);
    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);
    // DEFAULT_MAX_GAS_AMOUNT = 5000 
    const account = await getAptosAccount(aptos_key);
    const address = account.address();
    return [aptoswapClient,client,coinClient,account,address]
}

async function getCfgSettingsSwap(moduleName){

    const { swap_all_balance, balancePercent,transactions_count,delay_txns } = require("../config")[moduleName];
    const transactionsCount = await selectTransactionCount(transactions_count);
    return [swap_all_balance,balancePercent,transactionsCount,delay_txns]

}

async function getCfgSettingsAddLP(moduleName){

    const { pools_for_add_lp,balancePercent,delay_txns } = require("../config")[moduleName];
    return [pools_for_add_lp,balancePercent,delay_txns]
}

async function getCfgSettingsBurnLP(moduleName){

    const { delay_txns,pools_for_burn_lp } = require("../config")[moduleName];

    return [delay_txns,pools_for_burn_lp]
}
async function setupTokensForFullSwap(swap_all_balance,aptBalance,usdcBalance,usdtBalance){
    let availableTokens, fromToken, src, dst;
    if (swap_all_balance) {
        [availableTokens, fromToken, src, dst] = await selectTokensForFullSwap(aptBalance, usdcBalance, usdtBalance);
    } else {
        [availableTokens, fromToken, src, dst] = await selectTokensForSwap(aptBalance, usdcBalance, usdtBalance);
    }

    return [availableTokens, fromToken, src, dst]

}

async function setupFromAmountVAalue(availableTokens,fromToken,fromToken,fromBalance,amountPercent,client,logger, accountIndex, i,swapAllBalance){

    
    const [fromAmountPercentage, fromAmountValue, fromAmountFormatted] = await calculateFromAmount(fromToken, fromBalance, amountPercent, swapAllBalance, client, logger, accountIndex, i)

    return [fromAmountPercentage, fromAmountValue, fromAmountFormatted]
}

async function submitTransactionCheck(account,address,client,logger,accountIndex,txPayload,moduleString){
    try {
        let flag
        let rawTxn = await client.generateTransaction(address, txPayload);
        const sim = await client.simulateTransaction(account, rawTxn, {estimatePrioritizedGasUnitPrice: true, estimateGasUnitPrice: true, estimateMaxGasAmount: true});
        const max_gas_amount = sim[0].max_gas_amount
        const gas_used = sim[0].gas_used
        const gas_unit_price = sim[0].gas_unit_price
        rawTxn = await client.generateTransaction(address, txPayload,{gas_unit_price,max_gas_amount});
        const bcsTxn = await client.signTransaction(account, rawTxn);
        const {hash} = await client.submitTransaction(bcsTxn)
        
        
        if (await waitUntilTransactionProcessed(client, hash, logger, accountIndex,0,moduleString)) {flag = true}
        return [flag,hash]
    } catch (error) {
        logger.info(`${moduleString} - Transaction execution failed: ${error.message}`);
    }
}

async function setupDelayFunc(delay_txns,moduleString,logger){

    const delaySeconds = await selectDelay(delay_txns);
    logger.info(`${moduleString} - Delaying ${delaySeconds} seconds before next action`);
    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));

}

async function setupBalanceValue(address, coinClient, client,logger,addressIndex){

    let aptBalance, usdcBalance, usdtBalance
        try {
            
            aptBalance = await checkBalances(address, coinClient, client, 'APT');
            
            usdcBalance = await checkBalances(address, coinClient, client, 'USDC');
            
            usdtBalance = await checkBalances(address, coinClient, client, 'USDT');
            
            
            return [aptBalance,usdcBalance,usdtBalance]
        } catch (error) {
            logger.error(`[Account ${addressIndex}][Pancake][Swap] - An error occurred while checking balances - ${error.message}`)
            return;
        }

}

async function waitUntilTransactionProcessed(client, hash, logger, accountIndex,i,moduleString) {
    try {
        while (true) {
            const isPending = await client.transactionPending(hash);
            if (isPending) {
                logger.info(`${moduleString} - Transaction ${hash} is still pending, waiting for 10 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            } else {
                break;
            }
        }

        try {
            const transactionResult = await client.waitForTransactionWithResult(hash, { checkSuccess: true });

            if (transactionResult.success) {
                logger.info(`${moduleString} - Transaction ${hash} is confirmed successfully.`);
                logger.info(`${moduleString} - Check on explorer: https://explorer.aptoslabs.com/txn/${hash}`);
                return true;
            } else {
                logger.info(`${moduleString} - Transaction ${hash} is failed. Check on explorer: https://explorer.aptoslabs.com/txn/${hash}`);
                return false;
            }
        } catch (error) {
            if (error.name === 'FailedTransactionError') {
                logger.info(`${moduleString} - Transaction execution failed https://explorer.aptoslabs.com/txn/${hash}: ${error.message}`);
            } else {
                logger.info(`${moduleString} - An unexpected error occurred https://explorer.aptoslabs.com/txn/${hash}: ${error.message}`);
            }
            error.message = `${moduleString} ${error.message}`;
        }
    } catch (error) {
        logger.info(`${moduleString} - Error while waiting for transaction to be processed https://explorer.aptoslabs.com/txn/${hash}: ${error.message}`);
        error.message = `[waitUntilTransactionProcessed] ${error.message}`;
        throw error;
    }
}


async function checkBalances(address, coinClient, client, token_name) {
    try {
        
        if (token_name === 'APT') {
            balance = await coinClient.checkBalance(address)
            return balance ;
        }
    
        if (token_name === 'USDC') {
            const resourceusdc = await client.getAccountResource(
                address,
                ModulesMapping.USDC
            );
            return resourceusdc.data.coin.value;
        }
    
        if (token_name === 'USDT') {
            const resourceusdt = await client.getAccountResource(
                address,
                ModulesMapping.USDT
            );
            return resourceusdt.data.coin.value;
        }
    
        if (token_name === 'LIQUIDSWAP_LPAPTUSDC') {
            const resource_liquidswap_lpaptusdc = await client.getAccountResource(
                address,
                ModulesMapping.LIQUIDSWAP_LPAPTUSDC
            );
            return resource_liquidswap_lpaptusdc.data.coin.value;
        }
    
        if (token_name === 'LIQUIDSWAP_LPAPTUSDT') {
            const resource_liquidswap_lpaptusdt = await client.getAccountResource(
                address,
                ModulesMapping.LIQUIDSWAP_LPAPTUSDT
            );
            return resource_liquidswap_lpaptusdt.data.coin.value;
        }
        
        if (token_name === "PancakeSwap_LPAPTUSDC") {
            const resource_pancake_lpaptusdc = await client.getAccountResource(
                address,
                ModulesMapping.PancakeSwap_LPAPTUSDC
            );
            return resource_pancake_lpaptusdc.data.coin.value;
        }
    
        if (token_name === "PancakeSwap_LPAPTUSDT") {
            const resource_pancake_lpaptusdt = await client.getAccountResource(
                address,
                ModulesMapping.PancakeSwap_LPAPTUSDT
            );
            return resource_pancake_lpaptusdt.data.coin.value;
        }

        if (token_name === "AptoSwap_LPAPTUSDC") {
            const resource_AptoSwap_lpaptusdc = await client.getAccountResource(
                address,
                ModulesMapping.AptoSwap_LPAPTUSDC
            );
            return resource_AptoSwap_lpaptusdc.data.coin.value;
        }
    
        if (token_name === "AptoSwap_LPAPTUSDT") {
            const resource_AptoSwap_lpaptusdt = await client.getAccountResource(
                address,
                ModulesMapping.AptoSwap_LPAPTUSDT
            );
            return resource_AptoSwap_lpaptusdt.data.coin.value;
        }
    
        if (token_name === "ObricSwap_LPAPTUSDC") {
            const resource_obric_lpaptusdc = await client.getAccountResource(
                address,
                ModulesMapping.ObricSwap_LPAPTUSDC
            );
            return resource_obric_lpaptusdc.data.coin.value;
        }
    
        if (token_name === "AnimeSwap_LPAPTUSDC") {
            const resource_anime_lpaptusdc = await client.getAccountResource(
                address,
                ModulesMapping.AnimeSwap_LPAPTUSDC
            );
            return resource_anime_lpaptusdc.data.coin.value;
        }

        if (token_name === "AnimeSwap_LPAPTUSDT") {
            const resource_anime_lpaptusdt = await client.getAccountResource(
                address,
                ModulesMapping.AnimeSwap_LPAPTUSDT
            );
            return resource_anime_lpaptusdt.data.coin.value;
        }

        if (token_name === "AuxSwap_LPAPTUSDC") {
            const resource_aux_lpaptusdc = await client.getAccountResource(
                address,
                ModulesMapping.AuxSwap_LPAPTUSDC
            );
            return resource_aux_lpaptusdc.data.coin.value;
        }

        if (token_name === "AuxSwap_LPAPTUSDT") {
            const resource_aux_lpaptusdt = await client.getAccountResource(
                address,
                ModulesMapping.AuxSwap_LPAPTUSDT
            );
            return resource_aux_lpaptusdt.data.coin.value;
        }

        if (token_name === "DittoStake_StAPT") {
            const resource_ditto_stapt = await client.getAccountResource(
                address,
                ModulesMapping.DittoStake_StAPT
            );
            return resource_ditto_stapt.data.coin.value;
        }

        if (token_name === "TortugaStake_StAPT") {
            const TortugaStake_StAPT = await client.getAccountResource(
                address,
                ModulesMapping.TortugaStake_StAPT
            );
            return TortugaStake_StAPT.data.coin.value;
        }
        
    } catch (err) {
        err.message = `[Module 2][checkBalances] ${err.message}`;
        throw err;
    }
}


async function createMMAccount(privateKey) {
    const rpc_url = 'https://avalanche-mainnet.infura.io/v3/7ee94b980ba44740a102e74dbe383c03'
    const web3 = new Web3.default(rpc_url);
    return web3.eth.accounts.privateKeyToAccount(privateKey.trim());
}


async function selectTransactionCount(txnsCount) {
    const [minCount, maxCount] = txnsCount;
    return Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
}

async function selectPoolsCount(poolCount) {
    const [minPool, maxPool] = poolCount;
    return Math.floor(Math.random() * (maxPool - minPool + 1)) + minPool;
}


async function selectTokensForSwap(aptBalance, usdcBalance, usdtBalance) {
    let availableTokens = [];
    let availableToTokens = [];

    if (aptBalance > 20000) {
        availableTokens.push({ token: TokensMapping.APT, balance: aptBalance });
        availableToTokens.push(TokensMapping.USDC, TokensMapping.USDT);
    }
    if (usdcBalance > 0) {
        availableTokens.push({ token: TokensMapping.USDC, balance: usdcBalance });
        availableToTokens.push(TokensMapping.APT);
    }
    if (usdtBalance > 0) {
        availableTokens.push({ token: TokensMapping.USDT, balance: usdtBalance });
        availableToTokens.push(TokensMapping.APT);
    }

    if (availableTokens.length === 0) {
        console.log('No tokens with positive balance found.');
        return;
    }

    const fromToken = availableTokens[Math.floor(Math.random() * availableTokens.length)].token;
    let toToken;
    let src, dst;

    if (fromToken === TokensMapping.APT) {
        availableToTokens = availableToTokens.filter(token => token !== TokensMapping.APT);
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
        src = 'APT';
        dst = TokenNames[toToken];
    } else if (fromToken === TokensMapping.USDT) {
        availableToTokens = availableToTokens.filter(token => token !== TokensMapping.USDT && token !== TokensMapping.USDC);
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
        src = 'USDT';
        dst = TokenNames[toToken];
    } else if (fromToken === TokensMapping.USDC) {
        availableToTokens = availableToTokens.filter(token => token !== TokensMapping.USDC && token !== TokensMapping.USDT);
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
        src = 'USDC';
        dst = TokenNames[toToken];
    }

    return [availableTokens, fromToken, src, dst];
}


async function selectTokensForFullSwap(aptBalance, usdcBalance, usdtBalance) {
    let availableTokens = [];
    let availableToTokens = [];

    if (aptBalance > 1000000) {
        availableTokens.push({ token: TokensMapping.APT, balance: aptBalance });
        availableToTokens.push(TokensMapping.USDC, TokensMapping.USDT);
    }
    if (usdcBalance > 100000) {
        availableTokens.push({ token: TokensMapping.USDC, balance: usdcBalance });
        availableToTokens.push(TokensMapping.APT);
    }
    if (usdtBalance > 100000) {
        availableTokens.push({ token: TokensMapping.USDT, balance: usdtBalance });
        availableToTokens.push(TokensMapping.APT);
    }

    if (availableTokens.length === 0) {
        console.log('No tokens with positive balance found.');
        return;
    }

    const fromToken = availableTokens[Math.floor(Math.random() * availableTokens.length)].token;
    let toToken;
    let src, dst

    if (fromToken === TokensMapping.APT) {
        availableToTokens = availableToTokens.filter(token => token !== TokensMapping.APT);
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
        src = 'APT';
        dst = TokenNames[toToken];
    } else if (fromToken === TokensMapping.USDT) {
        availableToTokens = availableToTokens.filter(token => token !== TokensMapping.USDT && token !== TokensMapping.USDC);
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
        src = 'USDT';
        dst = TokenNames[toToken];
    } else if (fromToken === TokensMapping.USDC) {
        availableToTokens = availableToTokens.filter(token => token !== TokensMapping.USDC && token !== TokensMapping.USDT);
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
        src = 'USDC';
        dst = TokenNames[toToken];
    }

    return [availableTokens, fromToken, src, dst];
}


async function selectTokensForPool(aptBalance, existingToToken) {
    const availableToTokens = [TokensMapping.USDC, TokensMapping.USDT];
    let toToken;
    if (existingToToken === TokensMapping.USDC) {
        toToken = TokensMapping.USDT;
    } else {
        toToken = availableToTokens[Math.floor(Math.random() * availableToTokens.length)];
    }
    const src = 'APT';
    const dst = TokenNames[toToken];

    return [TokensMapping.APT, toToken, src, dst];
}



async function getGasPrice(client, logger, accountIndex, i) {
    let gasPrice;

    try {
        const get_gasPrice = await client.estimateGasPrice();
        gasPrice = BigInt(get_gasPrice.gas_estimate);
        return gasPrice;
    } catch (error) {
        logger.error(`[Account ${accountIndex}[AptoSwap][Swap][Transaction №${i+1}] - An error occurred:`, error.message);
    }
}


async function calculateFromAmount(fromToken, fromBalance, amountPercent, swapAllBalance, client, logger, addressIndex, i) {
    let amountDivider, fromAmountPercentage, fromAmountValue, fromAmountFormatted

    if (fromToken === TokensMapping.APT) {
        amountDivider = 10 ** 8;
    } else if (fromToken === TokensMapping.USDC || fromToken === TokensMapping.USDT) {
        amountDivider = 10 ** 6;
    }

    if (swapAllBalance === true) {
        if (fromToken === TokensMapping.APT) {
            fromAmountPercentage = 100; 
            fromAmountValue = fromBalance - 1000000n;
            fromAmountFormatted = Number(fromAmountValue) / amountDivider;
        } else {
            fromAmountPercentage = 100
            fromAmountValue = fromBalance
            fromAmountFormatted = Number(fromAmountValue) / amountDivider;
        }
    } else {
        const [minPercent, maxPercent] = amountPercent;
        fromAmountPercentage = Math.random() * (maxPercent - minPercent) + minPercent;
        fromAmountValue = Math.round((fromAmountPercentage / 100) * Number(fromBalance));
        fromAmountFormatted = fromAmountValue / amountDivider;
    }

    return [fromAmountPercentage, fromAmountValue, fromAmountFormatted];
}


async function selectDelay(delay) {
    const [mindelay, maxdelay] = delay
    return Math.floor(Math.random() * (maxdelay - mindelay + 1)) + mindelay;
}


module.exports = {
    getAptosAccount,
    checkBalances,
    createMMAccount,
    selectTokensForFullSwap,
    waitUntilTransactionProcessed,
    selectTransactionCount,
    selectPoolsCount,
    selectTokensForSwap,
    selectTokensForPool,
    calculateFromAmount,
    getGasPrice,
    selectDelay,
    getSDKOptions,
    getCfgSettingsSwap,
    setupBalanceValue,
    setupTokensForFullSwap,
    setupFromAmountVAalue,
    submitTransactionCheck,
    setupDelayFunc,
    getCfgSettingsAddLP,
    getRandomPair,
    setupAddLPBalance,
    getCfgSettingsBurnLP,
    setupCfgSettings,
    UnstakeSetupCfgSettings
}
