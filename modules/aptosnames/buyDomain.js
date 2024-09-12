const { AptosClient } = require("aptos");
const { processCollection } = require('./utils/parser.js');

const {
    delay_txns: delay
} = require('../../config.js').AptosNames;

const {
    Contracts,
    NODE_URL
} = require("../../utils/common.js");

const {
    getAptosAccount,
    waitUntilTransactionProcessed,
    selectDelay
} = require("../../utils/script_helpers.js");


async function register_aptos_domain (aptos_key, accountIndex, logger, module_name) {
    const moduleString = `[Account ${accountIndex}][${module_name}]`;
    logger.info(`${moduleString} - Starting Buying Aptos Domain`);

    const i = 0;

    const client = new AptosClient(NODE_URL);

    const account = await getAptosAccount(aptos_key);
    const address = account.address();

    const arguments = await processCollection();
    const creatorAddress = arguments.creator;
    const collection = arguments.collection;
    let nft = arguments.nftid;
    const price = arguments.price;
    const amount = price * 10 ** 9 + 1;
    let txPayload;
    txPayload = {
        function: Contracts.BlueMove_MINT,
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

    logger.info(`${moduleString} - Buying ${nft} domain`);

    try {
        const rawTxn = await client.generateTransaction(address, txPayload);
        const bcsTxn = await client.signTransaction(account, rawTxn);
        const {hash} = await client.submitTransaction(bcsTxn);
        await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i);
    } catch (error) {
        logger.info(`${moduleString} - Transaction execution failed: ${error.message}`);
    }

    let delaySeconds = await selectDelay(delay);
    logger.info(`${moduleString} - Delaying ${delaySeconds} seconds before next transaction`);
    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));

    nft = nft.replace('.apt', '');

    txPayload = {
        function: Contracts.AptosNames_REG,
        type_arguments: [],
        arguments: [
            '',
            nft
        ],
        type: "entry_function_payload"
    }

    nft += '.apt';
    logger.info(`Domain to acc ${nft}`);

    try {
        const rawTxn = await client.generateTransaction(address, txPayload);
        const bcsTxn = await client.signTransaction(account, rawTxn);
        const {hash} = await client.submitTransaction(bcsTxn);
        await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i);
    } catch (error) {
        logger.info(`${moduleString} - Transaction execution failed: ${error.message}`);
    }

    delaySeconds = await selectDelay(delay);
    logger.info(`${moduleString} - Delaying ${delaySeconds} seconds before next transaction`);
    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
}


module.exports = {
    register_aptos_domain
}
