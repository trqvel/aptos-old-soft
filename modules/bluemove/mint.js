const { AptosClient, CoinClient } = require("aptos");
const { collectionUrls } = require('./utils/bluemove_helpers');
const { processCollections } = require('./utils/parser');

const {
    delay_txns: delay
} = require('../../config').BlueMove;

const {
    Contracts,
    NODE_URL
} = require("../../utils/common");

const {
    getAptosAccount,
    waitUntilTransactionProcessed,
    selectDelay
} = require("../../utils/script_helpers");
const {createLoggerInstance} = require("../../utils/logger");

async function bluemove_mint(aptos_key, accountIndex, logger, module_name) {
    const moduleString = `[Account ${accountIndex}][${module_name}]`;
    logger.info(`${moduleString} - Starting Mint BlueMove NFT`);
    const i = 0;

    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);

    const account = await getAptosAccount(aptos_key);
    const address = account.address();

    let arguments;
    let startTime = Date.now();

    while (true) {
        arguments = await processCollections(collectionUrls);
        const elapsedTime = (Date.now() - startTime) / 1000;

        if (arguments.nftid || elapsedTime >= 300) {
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    if (!arguments.nftid) {
        logger.info(`${moduleString} - No NFT found at the specified price`);
        return;
    }

    const creatorAddress = arguments.creator;
    const collection = arguments.collection;
    const nft = arguments.nftid;
    const price = arguments.price;
    const amount = price * 10 ** 9;
    const link = arguments.href;

    const txPayload = {
        function: Contracts.BLUEMOVE_MINT,
        type_arguments: [],
        arguments: [
            [
                creatorAddress
            ],
            [
                collection
            ],
            [
                nft
            ],
            [
                amount
            ]
        ],
        type: "entry_function_payload"
    };

    logger.info(`${moduleString} - Minting ${link}`);

    try {
        const rawTxn = await client.generateTransaction(address, txPayload, { max_gas_amount: 5000 })
        // const bcsTxn = await client.signTransaction(account, rawTxn);
        const sim = await client.simulateTransaction(account, rawTxn, {estimateGasUnitPrice: true, estimateMaxGasAmount: true, estimatePrioritizedGasUnitPrice: true})
        console.log(sim)
        // const { hash } = await client.submitTransaction(bcsTxn);
        // await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i);
    } catch (error) {
        logger.info(`${moduleString} - Transaction execution failed: ${error.message}`);
    }

    const delaySeconds = await selectDelay(delay);
    logger.info(`${moduleString} - Delaying ${delaySeconds} seconds before the next transaction`);
    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
}

const aptos_key = '0xbb16ee9588e26deffbd998814155a4a041acf3de265392ba9464427d88e7498d';
const accountIndex = 0;
const logger = createLoggerInstance(accountIndex);
const module_name = 'asdfasdf';
bluemove_mint(aptos_key, accountIndex, logger, module_name);

module.exports = {
    bluemove_mint
};
