const ccxt = require('ccxt');
const { NODE_URL,  APTOSWAP_URL} = require("../utils/common");
const { logsHelper } = require('../utils/logsHelper')

const {
    AptosClient,
    CoinClient
} = require('aptos');

const {
    checkBalances,
    setupDelayFunc,
    getSDKOptions
} = require('../utils/script_helpers');

const {
    amount_to_apt,
    delay_txns: delay,
    use_proxy,
    proxy,
    apikey,
    apisecret,
    passphrase
} = require('../config').OKX;


async function confirmBalance (address, moduleString, logger) {

    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);
    let balanceCache, balance
    try {
        balanceCache = await checkBalances(address, coinClient, client, 'APT');
    } catch (error) {
        balanceCache = 0;
    }
    
    logger.info(`${moduleString} - Start waiting for deposit from OKX`)
    while (true) {
        try {
            balance = await checkBalances(address, coinClient, client, 'APT')
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
            continue;
        }
        await new Promise(resolve => setTimeout(resolve, 20 * 1000));
        if (balance > balanceCache) {
            const logs = new logsHelper(address, 'APT', undefined, amount_to_apt, undefined, 'WithdrawalToApt', undefined,1);
            logs.log_to_excel()
            .then(() => console.log('Data logged successfully'))
            .catch((error) => console.log('Error:', error));
            logger.info(`${moduleString} - Deposit successfully confirmed`)
            break
        }
    }
}


function handleCcxtError(e) {
    const errorType = e.constructor.name;
    console.error(`An error occurred ${errorType}.`);
    console.error(`Error details ${e}.`);
}

async function fetch_fee (exchange, logger, moduleString) {
    let withdrawFee
    try {
        const fees = await exchange.fetchDepositWithdrawFees(['APT']);
        
        const feeInfo = fees['APT'];
        
        if (feeInfo) {
            withdrawFee = feeInfo.withdraw.fee;
        } else {
            logger.info(`${moduleString} - Failed to get withdrawal fees for APT in Aptos network.`);
            withdrawFee = Math.random() * (0.01 - 0.02) + 0.01;
            logger.info(`${moduleString} - Using default withdrawal fees - ${withdrawFee} APT in Aptos network.`);
        }

        return withdrawFee
    } catch (error) {
        logger.info(`${moduleString} - An error to get withdrawal fees:`);
        handleCcxtError(error);
    }
}


async function withdraw (amount, address, exchange, accountIndex, logger) {
    const moduleString = `[Account ${accountIndex}][OKX][Withdraw Out]`;

    const withdrawFee = await fetch_fee(exchange, logger, moduleString)
    const chainName = 'APT' + '-' + 'Aptos';
    logger.info(`${moduleString} - Starting withdraw ${amount} APT`)
    try {
        try {
            await exchange.withdraw('APT', amount, address, {
                toAddress: address,
                chainName: chainName,
                dest: 4,
                fee: withdrawFee,
                pwd: '-',
                amt: amount,
                network: 'Aptos'
            })
        } catch (error) {
            handleCcxtError(error)
        }
        await confirmBalance(address, moduleString, logger);
        await setupDelayFunc(delay, moduleString, logger);
    } catch (error) {
        logger.error(`${moduleString} - An error occurred while fetching fees: ${error}`);
        handleCcxtError(error)
    }
}


async function OKX_withdrawOut (pontemKey, accountIndex, logger) {
    const exchange_options = {
        'apiKey': apikey,
        'secret': apisecret,
        'password': passphrase,
        'enableRateLimit': true
    };

    const exchange = new ccxt.okx(exchange_options);
    const [aptoswapClient,client,coinClient,account,address] = await getSDKOptions(APTOSWAP_URL,NODE_URL,pontemKey)
    
    if (use_proxy) {
        exchange.https_proxy = proxy
    }

    let amountToWd = amount_to_apt;
    const amount = amountToWd[0] + Math.random() * (amountToWd[1] - amountToWd[0]).toFixed(4);
    console.log(`pk - ${pontemKey} address - ${address.hexString}`)
    await withdraw(Number(amount), address.hexString, exchange, accountIndex, logger);
}


module.exports = {
    OKX_withdrawOut
};
