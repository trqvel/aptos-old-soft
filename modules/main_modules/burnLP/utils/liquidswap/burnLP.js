const {NODE_URL, TokensMapping} = require("../../../../../utils/common");
const {SDK} = require("@pontem/liquidswap-sdk");
const {AptosClient, CoinClient} = require("aptos");

const {
    getAptosAccount,
    checkBalances
} = require("../../../../../utils/script_helpers");


const {performBurnOperation} = require("./utils/liquidswap_helpers")


async function LiquidSwap_burnLP(aptos_key, accountIndex, logger) {
    logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Burn] - Starting LiquidSwap LP Burn`);

    const sdkOptions = {
        nodeUrl: NODE_URL,
        networkOptions: {
            modules: {
                Scripts: `0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2`,
                CoinInfo: '0x1::coin::CoinInfo',
                CoinStore: '0x1::coin::CoinStore',
            },
        },
    };

    const sdk = new SDK(sdkOptions);
    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);

    const account = await getAptosAccount(aptos_key);
    const address = account.address();

    const slippage = 0.005;

    const lpaptusdcbalance = await checkBalances(address, coinClient, client, 'LIQUIDSWAP_LPAPTUSDC')
    const lpaptusdtbalance = await checkBalances(address, coinClient, client, 'LIQUIDSWAP_LPAPTUSDT')
    
    
    await performBurnOperation("APT", "USDC", lpaptusdcbalance, accountIndex, logger, sdk, slippage, client, address, account);
    await performBurnOperation("APT", "USDT", lpaptusdtbalance, accountIndex, logger, sdk, slippage, client, address, account);
}


module.exports = {
    LiquidSwap_burnLP
}