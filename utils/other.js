const { General } =  require('../config.js');

const AptosSwapUrl = 'https://aptoswap.net';

const rpc = {
    Aptos: 'https://fullnode.mainnet.aptoslabs.com',
    Avalanche: 'https://avalanche.public-rpc.com'
};

const explorerTx = {
    Aptos: 'https://explorer.aptoslabs.com/txn/',
    Avalanche: 'https://snowtrace.io/tx/'
}

const TokensMapping = {
    APT: '0x1::aptos_coin::AptosCoin',
    USDC: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    USDT: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    WETH: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
    tAPT: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin',
    wWETH: '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T',
    wUSDC: '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
    wUSDT: '0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T',
    ceWETH: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin',
    ceWBTC: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin',
    ceUSDC: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin',
    ceUSDT: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin',
    ceBUSD: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BusdCoin',
    ceDAI: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin',
    ceBNB: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin'
};

const TokenNames = {
    '0x1::aptos_coin::AptosCoin': 'APT',
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC': 'USDC',
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT': 'USDT',
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH': 'WETH',
    '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T': 'wWETH',
    '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T': 'wUSDC',
    '0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T': 'wUSDT',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin': 'ceWETH',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin': 'ceWBTC',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin': 'ceUSDC',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin': 'ceUSDT',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BusdCoin': 'ceBUSD',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin': 'ceDAI',
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin': 'ceBNB'
};

const ModulesMapping = {
    USDC: '0x1::coin::CoinStore<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    USDT: '0x1::coin::CoinStore<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>',
    WETH: '0x1::coin::CoinStore<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH>',
    wWETH: '0x1::coin::CoinStore<0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T>',
    wUSDC: '0x1::coin::CoinStore<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>',
    wUSDT: '0x1::coin::CoinStore<0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T>',
    ceWETH: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin>',
    ceWBTC: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin>',
    ceUSDC: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>',
    ceUSDT: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin>',
    ceBUSD: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BusdCoin>',
    ceDAI: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin>',
    ceBNB: '0x1::coin::CoinStore<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin>',
    LiquidSwap_LPAPTUSDC: '0x1::coin::CoinStore<0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948::lp_coin::LP<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated>>',
    LiquidSwap_LPAPTUSDT: '0x1::coin::CoinStore<0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948::lp_coin::LP<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated>>',
    PancakeSwap_LPAPTUSDC: '0x1::coin::CoinStore<0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>>',
    PancakeSwap_LPAPTUSDT: '0x1::coin::CoinStore<0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>>',
    ObricSwap_LPAPTUSDC: '0x1::coin::CoinStore<0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b::piece_swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>>',
    AnimeSwap_LPAPTUSDC: '0x1::coin::CoinStore<0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf::LPCoinV1::LPCoin<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>>',
    AnimeSwap_LPAPTUSDT: '0x1::coin::CoinStore<0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf::LPCoinV1::LPCoin<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>>',
    AuxSwap_LPAPTUSDC: '0x1::coin::CoinStore<0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::LP<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>>',
    AuxSwap_LPAPTUSDT: '0x1::coin::CoinStore<0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::LP<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>>',
    AptoSwap_LPAPTUSDC: '0x1::coin::CoinStore<0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::LSP<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>>',
    AptoSwap_LPAPTUSDT: '0x1::coin::CoinStore<0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::LSP<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>>',
    DittoStake_StAPT: '0x1::coin::CoinStore<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos>',
    TortugaStake_StAPT: '0x1::coin::CoinStore<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin>'
};

const Contracts = {
    LiquidSwap_SWAP: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap',
    LiquidSwap_ADD_LP: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::add_liquidity',
    LiquidSwap_CURVE: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated',
    AptoSwap_SWAP: '0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::swap_y_to_x',
    AptoSwap_ADD_LP: '0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::add_liquidity',
    AptoSwap_BURN_LP:'0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::remove_liquidity',
    PancakeSwap_SWAP: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input',
    PancakeSwap_ADD_LP: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::add_liquidity',
    PancakeSwap_BURN_LP: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::remove_liquidity',
    AuxSwap_SWAP: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::swap_exact_coin_for_coin_with_signer',
    AuxSwap_ADD_LP: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::add_liquidity',
    AuxSwap_BURN_LP: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::remove_liquidity',
    AnimeSwap_SWAP: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1::swap_exact_coins_for_coins_entry',
    AnimeSwap_ADD_LP: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1::add_liquidity_entry',
    AnimeSwap_BURN_LP: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1::remove_liquidity_entry',
    ObricSwap_ADD_LP: '0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b::piece_swap_script::add_liquidity_script',
    ObricSwap_BURN_LP: '0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b::piece_swap_script::remove_liquidity_script',
    DittoStake_STAKE: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staking::stake_aptos',
    DittoStake_UNSTAKE: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staking::instant_unstake',
    TortugaStake_STAKE: '0x8f396e4246b2ba87b51c0739ef5ea4f26515a98375308c31ac2ec1e42142a57f::stake_router::stake',
    TortugaStake_INSTANTLY: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::swap_exact_coin_for_coin_with_signer',
    TortugaStake_1M: '0x8f396e4246b2ba87b51c0739ef5ea4f26515a98375308c31ac2ec1e42142a57f::stake_router::unstake',
    AptosNames_REG: '0x867ed1f6bf916171b1de3ee92849b8978b7d1b9e0a8cc982a3d19d535dfd9c0c::domains::register_domain_with_signature',
    BlueMove_MINT: '0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_buy_script',
    Cetus_SWAP: '0xa7f01413d33ba919441888637ca1607ca0ddcbfa3c0a9ddea64743aaa560e498::clmm_router::swap',
    Cetus_ADD_LP: '0xa7f01413d33ba919441888637ca1607ca0ddcbfa3c0a9ddea64743aaa560e498::clmm_router::add_liquidity_fix_token',
    Cetus_BURN_LP: '0xa7f01413d33ba919441888637ca1607ca0ddcbfa3c0a9ddea64743aaa560e498::clmm_router::remove_liquidity',
    Cetus_SWAP_BIGSTR_USDC:'0xdae1bde80d33bc5305fa12de9d098e5fc4017a1bc48d755558c50e9d9675a2d9',
    Cetus_SWAP_BIGSTR_USDT:'0xb612ed25e7b5a29cb41fcf7e608faf922f893b631f7bdab67eec4db98847d495',
    Cetus_SWAP_FROM_APT_TO_STABLE_STR:'4295048016',
    Cetus_SWAP_FROM_STABLE_TO_APT_STR:'79226673515401279992447579055',
    Cetus_ADD_LP_STR_USDC: '18446744073709531396',
    Cetus_ADD_LP_STR_USDT: '18446744073709533976',
    AriesMarkers_DEPOSIT: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::deposit',
    AriesMarkers_WITHDRAW: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::withdraw',
};

const SrcDstTokens = [
        { token: 'APT', minBalance: getMinBalance('APT'), toTokens: ['USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'USDC', minBalance: getMinBalance('USDC'), toTokens: ['APT', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'USDT', minBalance: getMinBalance('USDT'), toTokens: ['APT', 'USDC', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'WETH', minBalance: getMinBalance('WETH'), toTokens: ['APT', 'USDC', 'USDT', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'wWETH', minBalance: getMinBalance('WETH'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'wUSDC', minBalance: getMinBalance('USDC'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'wUSDT', minBalance: getMinBalance('USDT'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'ceWETH', minBalance: getMinBalance('WETH'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'ceWBTC', minBalance: getMinBalance('WBTC'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'ceUSDC', minBalance: getMinBalance('USDC'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDT', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'ceUSDT', minBalance: getMinBalance('USDT'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceBUSD', 'ceDAI', 'ceBNB'] },
        { token: 'ceBUSD', minBalance: getMinBalance('BUSD'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceDAI', 'ceBNB'] },
        { token: 'ceDAI', minBalance: getMinBalance('DAI'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceBNB'] },
        { token: 'ceBNB', minBalance: getMinBalance('BNB'), toTokens: ['APT', 'USDC', 'USDT', 'WETH', 'wWETH', 'wUSDC', 'wUSDT', 'ceWETH', 'ceWBTC', 'ceUSDC', 'ceUSDT', 'ceBUSD', 'ceDAI'] },
];

function getMinBalance (tokenName) {
    switch (tokenName) {
        case 'APT':
            return General.aptBalance * 10 ** 8;
        case 'USDC':
            return General.usdcBalance * 10 ** 6;
        case 'USDT':
            return General.usdtBalance * 10 ** 6;
        case 'BUSD':
            return General.wethBalance * 10 ** 8;
        case 'DAI':
            return General.wethBalance * 10 ** 8;
        case 'WETH':
            return General.wethBalance * 10 ** 6;
        case 'WBTC':
            return General.wethBalance * 10 ** 8;
        case 'BNB':
            return General.wethBalance * 10 ** 8;
    }
}

module.exports = {
    AptosSwapUrl,
    explorerTx,
    TokenNames,
    TokensMapping,
    getMinBalance,
    ModulesMapping,
    SrcDstTokens,
    rpc,
    Contracts
}