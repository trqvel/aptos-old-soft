const { createLogger, format, transports } = require('winston');
// const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const aptos = require('aptos');
const { AptosClient, AptosAccount, CoinClient } = require('aptos');
const { submitTransactionCheck } = require('./script_helpers');
const {Web3} = require("web3");

const rpc_url = 'https://polygon-rpc.com'
const web3 = new Web3(rpc_url);
const aptos_client = new aptos.AptosClient("https://fullnode.mainnet.aptoslabs.com");


async function registerCoin(client,aptos_address, pontemAcc, type_arguments,addressIndex,logger,coinName) {
    try {
        logger.info(`[Account ${addressIndex}][RegisterCoint][${coinName}] - Start registration ${coinName}`)
        const coinRegisterPayload = {
            type: 'entry_function_payload',
            function: '0x1::managed_coin::register',
            type_arguments: type_arguments,
            arguments: [],
        }
        
        await submitTransactionCheck(pontemAcc,aptos_address,aptos_client,logger,addressIndex,coinRegisterPayload,`[Account ${addressIndex}][RegisterCoint][${coinName}]`)
    } catch(e) {
      logger.error(`[Account ${addressIndex}][registerCoin] - Coin register error: `, e);
      throw e;
    }
  }


const writeToFile = async (fileName, data) => {
    const filePath = path.join(__dirname, fileName);
    try {
      await fs.promises.appendFile(filePath, data + '\n');
    } catch (error) {
      console.log(`Error writing to file ${fileName}:`, error);
      error.message = `[writeToFile] ${error.message}`;
      throw error;
    }
  };

const checkPrivateKeyExistence = async (aptos_address,addressIndex,logger) => {
    try {
        const privateKeyFile = path.join(__dirname, 'pontem_wallets_with_transactions.txt');
        const privateKeyData = await fs.promises.readFile(privateKeyFile, 'utf-8');
  
        const privateKeyList = privateKeyData.split('\n').map(line => line.trim());
        const keyExists = privateKeyList.includes(aptos_address);
        
        logger.info(`[Account ${addressIndex}][Check Key] - Checking for address in the file...`);
        logger.info(`[Account ${addressIndex}][Check Key] - Address existence: ${keyExists}`);

        return keyExists;

    } catch (error) {
        logger.error(`[Account ${addressIndex}][Bridge] - Ошибка при чтении файла с приватными ключами:`, error);
        error.message = `[checkPrivateKeyExistence] ${error.message}`;
        throw error;
    }
};


const GAS_LIMIT_SAFETY_BPS = 2000;

const claimCoinPayload = () => {
    return {
      function: `0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::coin_bridge::claim_coin`,
      type_arguments: [
        `0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC`,

      ],
      arguments: [],
    };
  };

const sendAndConfirmTransaction = async (account, payload) => {
    const options = await estimateGas(account, payload);
    const txnRequest = await aptos_client.generateTransaction(
      account.address(),
      payload,
      options
    );
    const signedTxn = await aptos_client.signTransaction(account, txnRequest);
    const res = await aptos_client.submitTransaction(signedTxn);
    return res.hash;
  };

const applyGasLimitSafety = (gasUsed) =>
  (BigInt(gasUsed) * BigInt(10000 + GAS_LIMIT_SAFETY_BPS)) / BigInt(10000);

const estimateGas = async (account, payload) => {

    const txnRequest = await aptos_client.generateTransaction(
      account.address(),
      payload
    );
    const sim = await aptos_client.simulateTransaction(account, txnRequest, {
      estimateGasUnitPrice: true,
      estimateMaxGasAmount: true,
    });
    const tx = sim[0];
    const max_gas_amount = applyGasLimitSafety(tx.gas_used).toString();
    return {
      max_gas_amount,
      gas_unit_price: tx.gas_unit_price,
    };
  };


const claim_coin = async (privateKey,logger,index) => {

    const aptos_account = new aptos.AptosAccount(Uint8Array.from(Buffer.from(privateKey.replace("0x", ""), "hex")));
  
    try {
      const tx_hash = await sendAndConfirmTransaction(aptos_account, claimCoinPayload(), privateKey);
  
      logger.info(
        `[Account ${index}][Claim Tokens] - ${aptos_account.address()}: Claim USDC -> https://explorer.aptoslabs.com/txn/${tx_hash}`
      );
    } catch (error) {
        logger.error(`[Account ${index}] Ошибка при выполнении claim coin:`, error);
        error.message = `[claim_coin] ${error.message}`;
    throw error;
    }
  };


const createAptosAccount = privateKey=> {
    return new aptos.AptosAccount(
        Uint8Array.from(Buffer.from(privateKey.replace("0x", ""), "hex"))
    );
};

async function claim_and_register(mmKey, pontemKey, addressIndex,logger) {


        const pontemAcc = createAptosAccount(pontemKey)
        const aptos_address = pontemAcc.address().toString()
    

        
        const privateKeyExists = await checkPrivateKeyExistence(aptos_address, addressIndex, logger);
        console.log(privateKeyExists)

        if (privateKeyExists === false) {
            await registerCoin(aptos_client,aptos_address, pontemAcc, ['0x1::aptos_coin::AptosCoin'],addressIndex,logger,'APT');
            await registerCoin(aptos_client,aptos_address, pontemAcc, ['0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC'],addressIndex,logger,'USDC');
            await registerCoin(aptos_client,aptos_address, pontemAcc, ['0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT'],addressIndex,logger,'USDT');
            logger.info(`[Account ${addressIndex}][Claim and Register] - Address not found in the file, proceeding to claim coin...`);
            await claim_coin(pontemKey, logger, addressIndex);
            await writeToFile('pontem_wallets_with_transactions.txt', aptos_address);
            logger.info(`[Account ${addressIndex}][Claim and Register] - Address added to the file.`);
        }

        
};


const delay = s => new Promise(resolve => setTimeout(resolve, s * 1000));



module.exports = { claim_and_register };
