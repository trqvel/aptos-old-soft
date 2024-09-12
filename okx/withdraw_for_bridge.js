const ccxt = require('ccxt');
const { NODE_URL, APTOSWAP_URL} = require("../utils/common");

const {
    setupDelayFunc,
    getSDKOptions
} = require('../utils/script_helpers');
const { Web3 } = require('web3');
const { usdcAbi } = require('../modules/bridge/abi.js');
const {OKX} = require("../config");

const {
    amount_to_usdc,
    amount_to_avax,
    delay_txns: delay,
    use_proxy,
    proxy,
    apikхey,
    apisecret,
    passphrase
} = require('../config').OKX;


function errorHandler (e) {
    const errorType = e.constructor.name;
    console.error(`An error occurred ${errorType}.`);
    console.error(`Error details ${e}.`);
}


async function confirmBalanceUSDC (address, moduleString, logger) {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://endpoints.omniatech.io/v1/avax/mainnet/public'));
    const usdc_address = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
    const usdc_contract = new web3.eth.Contract(usdcAbi, usdc_address);
    const balanceCache = await usdc_contract.methods.balanceOf(address).call();

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        const balance = await usdc_contract.methods.balanceOf(address).call();

        if (balance > balanceCache) {
            logger.info(`${moduleString} - Deposit confirmed on wallet`);
            break;
        } else {
            logger.info(`${moduleString} - Deposit not confirmed on wallet yet, waiting 15sec...`);
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        }
    }
}


async function confirmBalanceAVAX (address, moduleString, logger) {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://endpoints.omniatech.io/v1/avax/mainnet/public'));
    const balanceCache = await web3.eth.getBalance(address);

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        const balance = await web3.eth.getBalance(address);

        if (balance > balanceCache) {
            logger.info(`${moduleString} - Deposit confirmed on wallet`);
            break;
        } else {
            logger.info(`${moduleString} - Deposit not confirmed on wallet yet, waiting 15sec...`);
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        }
    }
}


async function fetch_feeUSDC (exchange) {
    let withdrawFee;
        try {
            const fees = await exchange.fetchDepositWithdrawFees(['USDC']);
            
            const feeInfo = fees.USDC.networks['Avalanche C'].withdraw.fee;
            
            if (feeInfo) {
                return feeInfo
            } else {
                return 0.0064
            }
        } catch (error) {
            
            handleCcxtError(error);
        }

    
}


async function fetch_feeAVAX (exchange) {
    let withdrawFee;
        try {
            const fees = await exchange.fetchDepositWithdrawFees(['AVAX']);
            let feeInfo = fees.AVAX.networks['Avalanche C'].withdraw.fee;
            if (feeInfo) {
                return feeInfo
            } else {
                return 0.0064
            }
        } catch (error) {
            
            handleCcxtError(error);
        }

    
}


async function withdrawUSDC (amount, address, exchange, accountIndex, logger) {
    const moduleString = `[Account ${accountIndex}][OKX][Withdraw Out]`;

    const fee = await fetch_feeUSDC(exchange)
    
    logger.info(`${moduleString} - Starting withdraw ${amount} USDC`)
    try {
        try {
            await exchange.withdraw('USDC', amount, address, {
                toAddress: address,
                chainName: 'USDC-Avalanche C-Chain',
                dest: 4,
                fee: fee,
                pwd: '-',
                amt: amount,
                network: 'Avalanche C-Chain',
            });
            
        } catch (error) {
            console.log(error);
        }
        await confirmBalanceUSDC(address, moduleString, logger);
        await setupDelayFunc(delay, moduleString, logger);
    } catch (error) {
        errorHandler(error)
    }
}


async function withdrawAVAX (amount, address, exchange, accountIndex, logger) {
    const moduleString = `[Account ${accountIndex}][OKX][Withdraw Out]`;

    const fee = await fetch_feeAVAX(exchange)
    console.log(fee)
    logger.info(`${moduleString} - Starting withdraw ${amount} AVAX`)
    try {
        try {
            await exchange.withdraw('AVAX', amount, address, {
                toAddress: address,
                chainName: 'AVAX-Avalanche C-Chain',
                dest: 4,
                fee: fee,
                pwd: '-',
                amt: amount,
                network: 'Avalanche C-Chain',
            });
        } catch (error) {
            console.log(error);
        }
        await confirmBalanceAVAX(address, moduleString, logger);
        await setupDelayFunc(delay, moduleString, logger);
    } catch (error) {
        errorHandler(error)
    }
}

async function OKX_withdrawOutBridge (mmKey, accountIndex, logger) {
    const exchange_options = {
        'apiKey': OKX.apikey,
        'secret': OKX.apisecret,
        'password': OKX.passphrase,
        'enableRateLimit': true
    };

    const rpc_url = 'https://avalanche.public-rpc.com'
    const web3 = new Web3(rpc_url);

    const exchange = new ccxt.okx(exchange_options);
    const account = web3.eth.accounts.privateKeyToAccount(mmKey.trim());
    const address = account.address

    if (use_proxy) {
        exchange.https_proxy = proxy
    }

    let amountToWdUSDC = amount_to_usdc;
    let amountToWdAVAX = amount_to_avax;
    const randomNumberUSDC = Math.floor(Math.random() * ((amountToWdUSDC[1]) - (amountToWdUSDC[0]) + 1)) + amountToWdUSDC[0];
    const randomNumberAVAX = Math.floor(Math.random() * ((amountToWdAVAX[1]) - (amountToWdAVAX[0]) + 1)) + amountToWdAVAX[0];
    await withdrawUSDC(randomNumberUSDC, address, exchange, accountIndex, logger);
    await withdrawAVAX(randomNumberAVAX, address, exchange, accountIndex, logger);
}


module.exports = {
    OKX_withdrawOutBridge
};
