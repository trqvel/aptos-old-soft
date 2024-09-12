const pkg2 = require('../../utils/logger.js');
const createLoggerInstance = pkg2.createLoggerInstance;
const pkg3 = require('../../utils/script_helpers.js');
const getAptosAccount = pkg3.getAptosAccount;
const waitUntilTransactionProcessed = pkg3.waitUntilTransactionProcessed;
const domainGenerator = require('./utils/generator.js').domainGenerator;
const AptosNames = require('../../config.js').AptosNames;
const AptosClient = require('aptos').AptosClient;
const pkg1 = require('../../utils/other.js');
const Contracts = pkg1.Contracts;
const rpc = pkg1.rpc;
const puppeteer = require('puppeteer');
const axios = require('axios');
const { initialize: initializeGenerator } = require('./utils/generator');


const getSequenceNumber = async (address) => {
    const url = `https://mainnet.aptoslabs.com/v1/accounts/${address}`;
    let response;

    response = await axios.get(url);

    return response.data.sequence_number;
}


const captchaSolver = async () => {
    console.log('solving captcha...');
    const captchaUrl = `http://rucaptcha.com/in.php?key=${AptosNames.captchaKey}&method=userrecaptcha&googlekey=6LdSUooiAAAAAMdpPgeiWzuTmCK2wzuswCrnWWku&pageurl=https://www.aptosnames.com&json=1`;

    try {
        let requestId;
        const response = await axios.get(captchaUrl);
        const responseData = response.data;

        if (responseData.status === 1) {
            requestId = responseData.request;
        } else {
            console.error(`captcha error:`, responseData);
            return false;
        }

        do {
            const responseUrl = `http://rucaptcha.com/res.php?key=${AptosNames.captchaKey}&action=get&id=${requestId}&json=1`;
            const response = await axios.get(responseUrl);
            const responseStatus = response.data.status;

            if (responseStatus === 1) {
                return response.data.request;
            }

            await new Promise(resolve => setTimeout(resolve, 10000));
        } while (true);
    } catch (error) {
        console.error('An error occurred:', error.message);
        return false;
    }
};


const getSignatureToMint = async (address, name) => {
    const captchaResponse = await captchaSolver();
    if (!captchaResponse) return false;

    const nonce = await getSequenceNumber(address);

    const url = 'https://www.aptosnames.com/api/mainnet/v1/verify';
    const payload = {
        recaptchaToken: captchaResponse,
        registerDomainProofChallenge: {
            sequenceNumber: nonce,
            registerAddress: address,
            domainName: name
        }
    };

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    let PROXY_ONLY_FOR_NAMES = '';
    let response;

    if (PROXY_ONLY_FOR_NAMES !== '') {
        config.proxy = {
            http: PROXY_ONLY_FOR_NAMES,
            https: PROXY_ONLY_FOR_NAMES
        };
    }

    try {
        response = await axios.post(url, payload, config);
        return response.data.signedMessage.hexString;
    } catch (error) {
        console.error('An error occurred:', error.message);
        return false;
    }
}


const checkDomainValid = async (name) => {
    const response = await fetch(`https://www.aptosnames.com/api/mainnet/v1/address/${name}`);
    const { address } = await response.json();
    return address
}

const checkDomainCost = async (name) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const url = `https://www.aptosnames.com/name/${name}`;

    try {
        await page.goto(url);

        await page.waitForSelector('.MuiTypography-root.MuiTypography-h5.css-1cv9zrq');

        const cost = await page.$eval('.MuiTypography-root.MuiTypography-h5.css-1cv9zrq', element => element.textContent);

        const numericValue = cost.match(/\d+/);

        if (numericValue) {
            return parseInt(numericValue[0]);
        } else {
            console.log('No cost value found');
            return null;
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    } finally {
        await browser.close();
    }
};


const registerAptosName = async (aptos_key, logger, accountIndex, module_name) => {
    const moduleString = `[Account ${accountIndex}][${module_name}]`;
    logger.info(`${moduleString} - Starting Minting Aptos Domain`);
    const client = new AptosClient(rpc.Aptos);

    const account = await getAptosAccount(aptos_key);
    const address = account.address();

    let name
    while (true) {
        await initializeGenerator();
        name = await domainGenerator();
        const domain = await checkDomainValid(name);
        const cost = await checkDomainCost(name);
        if (domain === undefined && cost <= AptosNames.maxAmountToMint) {
            break;
        }
    }

    const signature = await getSignatureToMint(address.hexString, name);
    const signatureHex = signature.substring(2);
    const signatureBytes = Buffer.from(signatureHex, 'hex');

    const txPayload = {
        function: Contracts.AptosNames_REG,
        type_arguments: [],
        arguments: [
            name,
            1,
            signatureBytes
        ],
        type: "entry_function_payload"
    };

    logger.info(`${moduleString} - Minting ${name} domain`);

    try {
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
        await waitUntilTransactionProcessed(client, hash, logger, accountIndex, moduleString)

    } catch (error) {
        logger.info(`${moduleString} - Transaction execution failed: ${error.message}`);
    }
}

module.exports = {
    registerAptosName
};