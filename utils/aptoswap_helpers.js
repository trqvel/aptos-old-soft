async function calculateMinToAmount(src, dst, pool, fromAmountValue, slippage) {
    let toAmountValue;
    if (src === 'APT') {
        toAmountValue = pool.getXToYMinOutputAmount(BigInt(fromAmountValue), 0.1);
    } else {
        toAmountValue = pool.getYToXMinOutputAmount(BigInt(fromAmountValue), 0.1);
    }

    const decimalPlaces = dst === 'APT' ? 8 : 6;
    const toAmountFormatted = Number(toAmountValue) / (10 ** decimalPlaces);

    return [(toAmountValue), toAmountFormatted];
}


async function calculateToAmount(src, dst, pool, fromAmountValue, slippage) {
    let toAmountValue;
    if (src === 'APT') {
        toAmountValue = pool.getXToYAmount(BigInt(fromAmountValue), slippage);
    } else {
        toAmountValue = pool.getYToXAmount(BigInt(fromAmountValue), slippage);
    }

    const decimalPlaces = dst === 'APT' ? 8 : 6;
    const toAmountFormatted = Number(toAmountValue) / (10 ** decimalPlaces);

    return [toAmountValue, toAmountFormatted];
}


async function calculateToAmountPool(src, dst, pool, fromAmountValue, slippage) {
    let toAmountValue;
    toAmountValue = pool.getXToYAmount(BigInt(fromAmountValue), slippage);

    const toAmountFormatted = Number(toAmountValue) / (10 ** 6)

    return [toAmountValue, toAmountFormatted]
}


async function selectPoolForSwap(pools, src, dst, TokensMapping, logger, addressIndex, i) {
    const tokenMapping = {
        'APT': TokensMapping.APT,
        'USDC': TokensMapping.USDC,
        'USDT': TokensMapping.USDT
    };

    let x = src === 'APT' ? tokenMapping[src] : tokenMapping[dst];
    let y = src === 'APT' ? tokenMapping[dst] : tokenMapping[src];

    const pool = pools.filter(p => p.type.xTokenType.name === x && p.type.yTokenType.name === y)[0];
    if (pool === undefined) {
        logger.error(`[Account ${addressIndex}[AptoSwap][Swap][Transaction №${i+1}] - Cannot find pool for Swap. Check token contract addresses or swap direction`)
        return;
    }

    const direction = src === 'APT' ? "forward" : "reverse";

    return [pool, direction];
}


module.exports = {
    calculateMinToAmount,
    calculateToAmount,
    calculateToAmountPool,
    selectPoolForSwap,
}
