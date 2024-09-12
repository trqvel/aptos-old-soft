const { AptosClient, CoinClient} = require('aptos');
const { SDK } = require('@pontem/liquidswap-sdk');
const { NODE_URL, TokensMapping} = require('../../../../../utils/common');

const {
    getAptosAccount,
    checkBalances,
    selectPoolsCount,
    selectTokensForPool,
    calculateFromAmount,
    waitUntilTransactionProcessed,
    selectDelay
} = require("../../../../../utils/script_helpers")

const {
    balancePercent: amountPercent,
    pools_counter: poolCount,
    delay_txns: delay,
} = require("../../../../../config").LiquidSwap;


async function LiquidSwap_addLP(aptos_key, accountIndex, logger,i,src,dst) {
    logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add] - Starting LiquidSwap LP Add`)
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

    const account = await getAptosAccount(aptos_key)
    const address = account.address()


    logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add] - Pool count: `)
    const moduleString = `[Account ${accountIndex}][LiquidSwap][AddLP]`

    const slippage = 0.005;

    let existingToToken

    
        let aptBalance, usdcBalance, usdtBalance
        try {
            aptBalance = await checkBalances(address, coinClient, client, 'APT');
            usdcBalance = await checkBalances(address, coinClient, client, 'USDC');
            usdtBalance = await checkBalances(address, coinClient, client, 'USDT');
        } catch (error) {
            logger.error(`[Account ${accountIndex}][LiquidSwap][LP][Add] - An error occurred while checking balances - ${error.message}`)
            return;
        }

        let fromToken = TokensMapping.APT
        let toToken = TokensMapping[dst]

        logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i + 1}] - Selected Pool: Pair ${src}/${dst}`)

        existingToToken = toToken;

        const fromBalance = aptBalance;
        const swapAllBalance = false;
        const [fromAmountPercentage, fromAmountValue, fromAmountFormatted] = await calculateFromAmount(fromToken, fromBalance, amountPercent, swapAllBalance, client, logger, accountIndex, i);

        logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i + 1}] - Selected Percent Amount: ${fromAmountPercentage}`);

        const { rate } = await sdk.Liquidity.calculateRateAndMinReceivedLP({
            fromToken: fromToken,
            toToken: toToken,
            amount: fromAmountValue,
            curveType: 'uncorrelated',
            interactiveToken: 'from',
            slippage: 0.005,
        })

        const { receiveLp } = await sdk.Liquidity.calculateRateAndMinReceivedLP({
            fromToken: fromToken,
            toToken: toToken,
            amount: fromAmountValue,
            curveType: 'uncorrelated',
            interactiveToken: 'from',
        })

        if (dst === "USDC" && usdcBalance < rate) {
            logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i + 1}] - Not enough ${rate / 10 ** 6} ${dst} to add`);

            const toAmounteVal = rate - usdcBalance

            const fromAmountVal = await sdk.Swap.calculateRates({
                fromToken: fromToken,
                toToken: toToken,
                amount: toAmounteVal,
                curveType: "uncorrelated",
                interactiveToken: "to"
            });

            logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i+1}] - Starting swap ${src} to get ${Number(toAmounteVal) / 10 ** 6} ${dst}`)

            const txPayload = await sdk.Swap.createSwapTransactionPayload({
                fromToken: fromToken,
                toToken: toToken,
                fromAmount: fromAmountVal,
                toAmount: toAmounteVal,
                interactiveToken: "from",
                slippage: slippage,
                stableSwapType: "normal",
                curveType: "uncorrelated"
            });

            logger.info(`[Account ${accountIndex}][LiquidSwap][Swap][Transaction №${i+1}] - Swap from ${src} to ${dst} | Get ${toAmounteVal / 10 ** 6} ${dst} for ${Number(fromAmountVal) / 10 ** 8} ${src}`)

            try {
                let rawTxn = await client.generateTransaction(address, txPayload);
                const sim = await client.simulateTransaction(account, rawTxn, {estimatePrioritizedGasUnitPrice: true, estimateGasUnitPrice: true, estimateMaxGasAmount: true});
                const max_gas_amount = sim[0].max_gas_amount
                const gas_used = sim[0].gas_used
                const gas_unit_price = sim[0].gas_unit_price
                rawTxn = await client.generateTransaction(address, txPayload,{gas_unit_price,max_gas_amount});
                const bcsTxn = await client.signTransaction(account, rawTxn);
                const {hash} = await client.submitTransaction(bcsTxn)
                await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i,`[Account ${accountIndex}][LiquidSwap][Swap][Transaction №${i+1}]`);

            } catch (error) {
                logger.error(`[Account ${accountIndex}][LiquidSwap][Swap][Transaction №${i + 1}] - Transaction execution failed: ${error.message}`);
            }

            const delaySeconds = await selectDelay(delay);
            logger.info(`[Account ${accountIndex}][LiquidSwap][Swap] - Delaying ${delaySeconds} seconds before next step`);
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        }

        if (dst === "USDT" && usdtBalance < rate) {
            logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i + 1}] - Not enough ${rate / 10 ** 6} ${dst} to add`);

            const toAmounteVal = rate - usdtBalance

            const fromAmountVal = await sdk.Swap.calculateRates({
                fromToken: fromToken,
                toToken: toToken,
                amount: toAmounteVal,
                curveType: "uncorrelated",
                interactiveToken: "to"
            });

            logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i+1}] - Starting swap ${src} to get ${Number(toAmounteVal) / 10 ** 6} ${dst}`)

            const txPayload = await sdk.Swap.createSwapTransactionPayload({
                fromToken: fromToken,
                toToken: toToken,
                fromAmount: fromAmountVal,
                toAmount: toAmounteVal,
                interactiveToken: "from",
                slippage: slippage,
                stableSwapType: "normal",
                curveType: "uncorrelated"
            });

            logger.info(`[Account ${accountIndex}][LiquidSwap][Swap][Transaction №${i+1}] - Swap from ${src} to ${dst} | Get ${toAmounteVal / 10 ** 6} ${dst} for ${Number(fromAmountVal) / 10 ** 8} ${src}`)

            try {
                let rawTxn = await client.generateTransaction(address, txPayload);
                const sim = await client.simulateTransaction(account, rawTxn, {estimatePrioritizedGasUnitPrice: true, estimateGasUnitPrice: true, estimateMaxGasAmount: true});
                const max_gas_amount = sim[0].max_gas_amount
                const gas_used = sim[0].gas_used
                const gas_unit_price = sim[0].gas_unit_price
                rawTxn = await client.generateTransaction(address, txPayload,{gas_unit_price,max_gas_amount});
                const bcsTxn = await client.signTransaction(account, rawTxn);
                const {hash} = await client.submitTransaction(bcsTxn)
                await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i,`[Account ${accountIndex}][LiquidSwap][Swap][Transaction №${i+1}]`);

            } catch (error) {
                logger.error(`[Account ${accountIndex}][LiquidSwap][Swap][Transaction №${i + 1}] - Transaction execution failed: ${error.message}`);
            }

            const delaySeconds = await selectDelay(delay);
            logger.info(`[Account ${accountIndex}][LiquidSwap][Swap] - Delaying ${delaySeconds} seconds before next step`);
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        }

        const txPayload = await sdk.Liquidity.createAddLiquidityPayload({
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: fromAmountValue,
            toAmount: rate,
            interactiveToken: "from",
            slippage: slippage,
            curveType: "uncorrelated",
        });

        logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i+1}] - Pair ${src}/${dst} | Add ${fromAmountFormatted} ${src} / ${rate / 10 ** 6} ${dst} to get ${receiveLp / 10 ** 6} LP`)

        try {
            let rawTxn = await client.generateTransaction(address, txPayload);
            const sim = await client.simulateTransaction(account, rawTxn, {estimatePrioritizedGasUnitPrice: true, estimateGasUnitPrice: true, estimateMaxGasAmount: true});
            const max_gas_amount = sim[0].max_gas_amount
            const gas_used = sim[0].gas_used
            const gas_unit_price = sim[0].gas_unit_price
            rawTxn = await client.generateTransaction(address, txPayload,{gas_unit_price,max_gas_amount});
            const bcsTxn = await client.signTransaction(account, rawTxn);
            const {hash} = await client.submitTransaction(bcsTxn)
            await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i,`[Account ${accountIndex}][LiquidSwap][LP][Add][Pool №${i+1}]`);

        } catch (error) {
            logger.error(`[Account ${accountIndex}][LiquidSwap][LP][Add][Transaction №${i + 1}] - Transaction execution failed: ${error.message}`);
        }

        const delaySeconds = await selectDelay(delay);
        logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Add] - Delaying ${delaySeconds} seconds before next transaction`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
}


module.exports = {
    LiquidSwap_addLP
}