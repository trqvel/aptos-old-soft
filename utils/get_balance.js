const {ModulesMapping} = require("./common");


async function checkBalances(address, coinClient, client, token_name) {
    try {
        const tokenModuleMapping = {
            'APT': async () => await coinClient.checkBalance(address),
            'USDC': ModulesMapping.USDC,
            'USDT': ModulesMapping.USDT,
            'LIQUIDSWAP_LPAPTUSDC': ModulesMapping.LIQUIDSWAP_LPAPTUSDC,
            'LIQUIDSWAP_LPAPTUSDT': ModulesMapping.LIQUIDSWAP_LPAPTUSDT,
            'PANCAKE_LPAPTUSDC': ModulesMapping.PANCAKE_LPAPTUSDC,
            'PANCAKE_LPAPTUSDT': ModulesMapping.PANCAKE_LPAPTUSDT,
            'OBRIC_LPAPTUSDC': ModulesMapping.OBRIC_LPAPTUSDC,
            'ANIME_LPAPTUSDC': ModulesMapping.ANIME_LPAPTUSDC,
            'ANIME_LPAPTUSDT': ModulesMapping.ANIME_LPAPTUSDT,
            'AUX_LPAPTUSDC': ModulesMapping.AUX_LPAPTUSDC,
            'AUX_LPAPTUSDT': ModulesMapping.AUX_LPAPTUSDT,
            'DITTO_StAPT': ModulesMapping.DITTO_StAPT,
        };

        if (token_name === 'APT') {
            return await tokenModuleMapping[token_name]();
        } else if (tokenModuleMapping.hasOwnProperty(token_name)) {
            const resource = await client.getAccountResource(address, tokenModuleMapping[token_name]);
            return resource.data.coin.value;
        } else {
            throw new Error(`[Module 2][checkBalances] Token not supported: ${token_name}`);
        }

    } catch (err) {
        err.message = `[Module 2][checkBalances] ${err.message}`;
        throw err;
    }
}

module.exports = {
    checkBalances
};
