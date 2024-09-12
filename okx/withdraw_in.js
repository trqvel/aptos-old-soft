const { NODE_URL, TokensMapping } = require('../utils/common');
const { logsHelper } = require('../utils/logsHelper')
const {mainSwapFunction} = require('./swapAllBalance')
const {
    AptosClient,
    CoinClient
} = require('aptos');

const {
    getAptosAccount,
    checkBalances,
    waitUntilTransactionProcessed,
    setupDelayFunc
} = require('../utils/script_helpers');

const {
    delay_txns: delay,
    amount_to_safe
} = require('../config').OKX;


async function OKX_withdrawIn(aptos_key, okex_address, accountIndex, logger) {
    const moduleString = `[Account ${accountIndex}][OKX][Withdraw In]`;
    logger.info(`${moduleString} - Start withdrawal to ${okex_address}`);

    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);

    const account = await getAptosAccount(aptos_key);
    const address =  account.address();
    const usdcBalance = await checkBalances(address,coinClient,client,'USDC')
    const usdtBalance = await checkBalances(address,coinClient,client,'USDT')
    if (usdcBalance > 0){await mainSwapFunction(aptos_key,logger,accountIndex,'PancakeSwap','USDC','APT')}
    if (usdtBalance > 0){await mainSwapFunction(aptos_key,logger,accountIndex,'PancakeSwap','USDT','APT')}
    let aptBalance
    try {
        aptBalance = await checkBalances(address, coinClient, client, 'APT');
    } catch (error) {
        logger.error(`${moduleString} - An error occurred while checking balances - ${error.message}`)
        return;
    }
    
    let createReceiverIfMissing = false;
    try {
        await client.getAccount(okex_address);
    } catch (error) {
        createReceiverIfMissing = true;
    }

    let amountToStay = amount_to_safe;
    const randomNumber = Math.floor(Math.random() * ((amountToStay[1]* 10**8) - (amountToStay[0]* 10**8) + 1)) + amountToStay[0] * 10**8;
    const amount = aptBalance - BigInt(randomNumber);
    try {
        const txPayload = {
            function: '0x1::aptos_account::transfer_coins',
            type_arguments: [
                TokensMapping.APT
            ],
            arguments: [
                okex_address,
                amount,
            ],
            type: 'entry_function_payload'
        }

        let rawTxn = await client.generateTransaction(address, txPayload);
        const sim = await client.simulateTransaction(account, rawTxn, {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
            estimatePrioritizedGasUnitPrice: true
        });

        const max_gas_amount = sim[0].max_gas_amount;
        const gas_unit_price = sim[0].gas_unit_price;
        rawTxn = await client.generateTransaction(address, txPayload, { gas_unit_price, max_gas_amount });
        const bcsTxn = await client.signTransaction(account, rawTxn);
        const { hash } = await client.submitTransaction(bcsTxn);
        if(await waitUntilTransactionProcessed(client, hash, logger, accountIndex,0, moduleString)){
            const logs = new logsHelper(address, 'APT', undefined, amount, undefined, 'WithdrawalFromApt',undefined);
            logs.log_to_excel()
            .then(() => logger.info(`${moduleString} - Data logged successfully`))
            .catch((error) => logger.info('Error via logs:', error));
        }
    } catch (error) {
        logger.info(`${moduleString} - Transaction execution failed: ${error.message}`);
    }

    await setupDelayFunc(delay, moduleString, logger)
}


module.exports = {
    OKX_withdrawIn
}