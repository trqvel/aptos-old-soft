const aptos = require('aptos');
const fs = require('fs');
const path = require('path');
const AptosBridge = require('../../config').AptosBridge;
const { Web3 } = require('web3');

const rpc_url = 'https://avalanche.public-rpc.com'
const web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
const aptos_client = new aptos.AptosClient("https://fullnode.mainnet.aptoslabs.com");
const usdc_address = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
const bridge_address = '0xA5972EeE0C9B5bBb89a5B16D1d65f94c9EF25166';

const currentDirname = __dirname;
const { usdcAbi,bridgeAbi } = require('../bridge/abi');
const {AptosClient, CoinClient} = require("aptos");
const {NODE_URL} = require("../../utils/common");
const {checkBalances} = require("../../utils/script_helpers");
const {logsHelper} = require("../../utils/logsHelper");

const usdc_contract = new web3.eth.Contract(usdcAbi, usdc_address);
const bridge_contract = new web3.eth.Contract(bridgeAbi, bridge_address);

const createMMAccount = async (mmKey) => {
    return web3.eth.accounts.privateKeyToAccount(mmKey.trim());
}

const createAptosAccount = async (AptosKey) => {
    return new aptos.AptosAccount(
        Uint8Array.from(Buffer.from(AptosKey.replace("0x", ""), "hex"))
    );
}

const getUSDCBalanceAvalanche = async (address) => {
    return await usdc_contract.methods.balanceOf(address).call();
}

const approveUSDC = async (account,logger,moduleString) =>{

    try{
        logger.info(`${moduleString}[Approve] - Start approve USDC on Avalanche`)
        const approveAmount = (await getUSDCBalanceAvalanche(account.address)) * BigInt(5)
        const approveTx = await usdc_contract.methods.approve(
            '0x488863D609F3A673875a914fBeE7508a1DE45eC6',approveAmount
        ).encodeABI()

        const gasPrice = await web3.eth.getGasPrice();
        const nonce =  await web3.eth.getTransactionCount(account.address);

        const tx = {
            'to': usdc_address,
            'data': approveTx,
            'nonce': nonce,
            'gas': 150000,
            'type': '0x2',
            'maxFeePerGas': parseInt(Number(gasPrice) * 1.1),
            'maxPriorityFeePerGas': gasPrice,
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        return receipt.transactionHash;

    }catch (e) {
        logger.info(`${moduleString}[Approve] - Error ${e}`)
    }

}

const mainBridgeFunction = async (account, aptosAddress) => {

    try {
        const address = await account.address;
        const nonce = await web3.eth.getTransactionCount(address);
        const gasPrice = await web3.eth.getGasPrice();
        aptosAddress = aptosAddress.hexString.toLowerCase();
        const byteAddress1 = aptosAddress.slice(2);
        const randomAmountToRefuel = Math.floor((Math.random() * (AptosBridge.amountGasOnDestination[1] - AptosBridge.amountGasOnDestination[0]) + AptosBridge.amountGasOnDestination[0]) * 100000) / 100000

        const amountToRefuel = web3.utils.toWei((randomAmountToRefuel/10).toString(), 'gwei');

        let refuel = BigInt(amountToRefuel).toString(16);
        const bits = refuel.length;
        const code = '0'.repeat(64 - bits) + refuel;
        const callParams = [address, '0x0000000000000000000000000000000000000000'];
        const string1 = `0x00020000000000000000000000000000000000000000000000000000000000002710${code}${byteAddress1}`;


        const fees = await bridge_contract.methods.quoteForSend(callParams, string1).call();
        const fee = fees[0];

        let amountUsdcTobridge = (await getUSDCBalanceAvalanche(address))
        // console.log(usdc_address)
        // console.log(aptosAddress)
        // console.log(amountUsdcTobridge)
        // console.log(callParams)
        // console.log(string1)

        const bridgeTxn = bridge_contract.methods.sendToAptos(
            usdc_address, aptosAddress, amountUsdcTobridge, callParams, string1
        ).encodeABI();

        const tx = {
            'to': bridge_address,
            'data': bridgeTxn,
            'nonce': nonce,
            'gas': 400000,
            'type': '0x2',
            'maxFeePerGas':((gasPrice) +BigInt(1500000000) ),
            'maxPriorityFeePerGas': (1500000000).toString(),
            'value': fee
        };


        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        return receipt.transactionHash;


    }catch (e) {
    console.log(e)
    }

}

const mainFunctionBridge = async (mmKey,AptosKey,logger,moduleString) => {

    const mmAccount = await createMMAccount(mmKey)
    const AptosAccount = await createAptosAccount(AptosKey)
    const AptosAddress = AptosAccount.address()

    logger.info(`${moduleString}[Bridge] - Started work with : ${mmAccount.address}`);

    const txApproveHash = await approveUSDC(mmAccount,logger,moduleString);

    let approveTxReceipt = null;

    while (!approveTxReceipt) {
        approveTxReceipt = await web3.eth.getTransactionReceipt(txApproveHash);

        if (!approveTxReceipt) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    if (!approveTxReceipt.status) {
        throw new Error('Approve Transaction failed');
    }

    logger.info(`${moduleString}[Approve] - Approved successfully, TX LINK: https://snowtrace.io/tx/${txApproveHash}`)

    logger.info(`${moduleString} - Start bridging USDC from Avalanche to Aptos`)

    const bridgeTxHash = await mainBridgeFunction(mmAccount,AptosAddress)


    let bridgeTxReceipt = null;

    while (!bridgeTxReceipt) {
        bridgeTxReceipt = await web3.eth.getTransactionReceipt(bridgeTxHash);
        if (!bridgeTxReceipt) {

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    if (!bridgeTxReceipt.status) { // status будет true, если транзакция успешно завершена
        throw new Error('Bridge Transaction failed');
    }
    logger.info(`${moduleString} - Approved successfully, TX LINK: https://snowtrace.io/tx/${bridgeTxHash}`)
    logger.info(`${moduleString} - Bridge successfully confirmed`)
    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);
    let balanceCache, balance
    try {
        balanceCache = await checkBalances(AptosAddress, coinClient, client, 'APT');
    } catch (error) {
        balanceCache = 0;
    }

    logger.info(`${moduleString} - Start waiting for deposit from OKX`)
    while (true) {
        try {
            balance = await checkBalances(AptosAddress, coinClient, client, 'APT')
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
            continue;
        }
        await new Promise(resolve => setTimeout(resolve, 20 * 1000));
        if (balance > balanceCache) {
            logger.info(`${moduleString} - Deposit successfully confirmed`)
            break
        }
    }


}


module.exports = {
    mainFunctionBridge
}