const {TokensMapping} = require("../../../../../../utils/common");

const {
    waitUntilTransactionProcessed,
    selectDelay
} = require("../../../../../../utils/script_helpers");

const { delay_txns: delay } = require("../../../../../../config").LiquidSwap;


async function performBurnOperation(fromToken, toToken, balance, accountIndex, logger, sdk, slippage, client, address, account) {
    const i = 0
    if (balance > 0) {

        const output = await sdk.Liquidity.calculateOutputBurn({
            fromToken: TokensMapping[fromToken],
            toToken: TokensMapping[toToken],
            slippage: slippage,
            curveType: "uncorrelated",
            burnAmount: balance
        });

        const aptToGet = output.withoutSlippage.x;
        const tokenToGet = output.withoutSlippage.y;

        logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Burn] - Burning ${balance / 10 ** 6} LP${fromToken}${toToken} | Get ${aptToGet / 10 ** 8} ${fromToken} / ${tokenToGet / 10 ** 6} ${toToken}`);

        const txPayload = await sdk.Liquidity.createBurnLiquidityPayload({
            fromToken: TokensMapping[fromToken],
            toToken: TokensMapping[toToken],
            slippage: slippage,
            curveType: "uncorrelated",
            burnAmount: balance
        });
        try {
            let rawTxn = await client.generateTransaction(address, txPayload);
            const sim = await client.simulateTransaction(account, rawTxn, {estimatePrioritizedGasUnitPrice: true, estimateGasUnitPrice: true, estimateMaxGasAmount: true});
            const max_gas_amount = sim[0].max_gas_amount
            const gas_used = sim[0].gas_used
            const gas_unit_price = sim[0].gas_unit_price
            rawTxn = await client.generateTransaction(address, txPayload,{gas_unit_price,max_gas_amount});
            const bcsTxn = await client.signTransaction(account, rawTxn);
            const {hash} = await client.submitTransaction(bcsTxn)
            await waitUntilTransactionProcessed(client, hash, logger, accountIndex, i,`[Account ${accountIndex}][LiquidSwap][BurnLP]`);

        } catch (error) {
            logger.error(`[Account ${accountIndex}][LiquidSwap][LP][Burn][Transaction №${i+1}] - Transaction execution failed: ${error.message}`)
        }

        const delaySeconds = await selectDelay(delay);
        logger.info(`[Account ${accountIndex}][LiquidSwap][LP][Burn] - Delaying ${delaySeconds} seconds before next step`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
    }
}


module.exports = {
    performBurnOperation
}