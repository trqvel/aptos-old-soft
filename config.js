class ActiveModules {
    modules = ['LiquidSwap','AptoSwap','AnimeSwap','PancakeSwap','AuxSwap','BlueMove','ObricSwap','Certus','TortugaStake','DittoStake']
    //modules =['LiquidSwap','AptoSwap','AnimeSwap','PancakeSwap','AuxSwap','ObricSwap','Certus','TortugaStake','DittoStake','BlueMove','AptosNames']
}

class General {

    threads_counter = 5 // количество кошельков, которые будут выполняться одноврекменно
    shuffle = true // рандомизация модулей

}

//_______________________________________________Aptos Bridge_______________________________________________\\

class AptosBridge {
    useBridge = false // хотим ли мы использовать мост
    withdrawalFromOkxForBridge = false // хотим ли мы выводить USDC и AVAX для бриджа, можно выключить, если на аккаунете уже есть деньги
    amountGasOnDestination = [0.1, 0.1] // максимум 0.1, контракт больше не дает отправить
    delay_txns = [10,10]
}

class AptosNames {

    captchaKey = '';
    proxy = ''; // Мобильные прокси только для https://www.aptosnames.com

    maxAmountToBuy = 3;// Максимальная сумма в APT для покупки домена
    maxAmountToMint = 1; // Максимальная сумма в APT для минта домена
    delay = [1, 2];
}

//_______________________________________________OKX_______________________________________________\\
class OKX {
    // если включен параметр useBridge, то параметр withdraw_in_module должен быть false
    // если параметр useBridge выключен, тогда включаем параметр withdraw_in_module
    withdraw_in_module = true; // хотим ли мы выводить с биржи в сеть аптоса
    withdraw_out_module = false; // хотим ли выводить аптос после прогона обратно на биржу

    amount_to_apt = [0.103, 0.107]; // количество аптоса на вывод

    amount_to_usdc = [0.01, 0.01];
    amount_to_avax = [0.2, 0.2];

    amount_to_safe = [0.001, 0.002]; // количество аптоса, которое останется на кошельке
    delay_txns = [10, 30]; // задержка

    use_proxy = true;
    proxy = '';
    apikey = '';
    apisecret = '';
    passphrase = '';

}

//________________________________________________LiquidSwap________________________________________________\\

class LiquidSwap {
    //                   MODULES
    shuffle = false

    swap_module = true;             // Swap txns                               | true | false |
    add_liqudity_module = true;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = true;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    swap_all_balance = true;        // Use 100% of Balance                     | true | false |
    balancePercent = [5, 5];       // Random % of Balance                     | 1 | N |
    transactions_count = [2, 3];     // Txns Count                              | 1 | N |

    delay_txns = [20, 40];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC","APT/USDT"]
    pools_for_burn_lp = ["APT/USDC","APT/USDT"]
}

//________________________________________________AptoSwap__________________________________________________\\

class AptoSwap {
                                     //                   MODULES
    //                   MODULES
    shuffle = false


    swap_module = true;             // Swap txns                               | true | false |
    add_liqudity_module = true;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = true;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    swap_all_balance = true;        // Use 100% of Balance                     | true | false |
    balancePercent = [5, 5];       // Random % of Balance                     | 1 | N |
    transactions_count = [2, 5];     // Txns Count                              | 1 | N |

    delay_txns = [20, 40];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC","APT/USDT"]
    pools_for_burn_lp = ["APT/USDC","APT/USDT"]
}

//________________________________________________PancakeSwap_______________________________________________\\

class PancakeSwap {
    //                   MODULES
    shuffle = false

    swap_module = true;             // Swap txns                               | true | false |
    add_liqudity_module = true;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = true;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    swap_all_balance = true;        // Use 100% of Balance                     | true | false |
    balancePercent = [5, 5];       // Random % of Balance                     | 1 | N |
    transactions_count = [2, 5];     // Txns Count                              | 1 | N |

    delay_txns = [20, 40];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC","APT/USDT"]
    pools_for_burn_lp = ["APT/USDC","APT/USDT"]
}

//________________________________________________AnimeSwap________________________________________________\\

class AnimeSwap {
    //                   MODULES
    shuffle = false

    swap_module = true;             // Swap txns                               | true | false |
    add_liqudity_module = true;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = true;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    swap_all_balance = true;        // Use 100% of Balance                     | true | false |
    balancePercent = [5, 5];       // Random % of Balance                     | 1 | N |
    transactions_count = [2, 5];     // Txns Count                              | 1 | N |

    delay_txns = [20, 40];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC","APT/USDT"]
    pools_for_burn_lp = ["APT/USDC","APT/USDT"]
}

//_________________________________________________AuxSwap_________________________________________________\\

class AuxSwap {
    //                   MODULES
    shuffle = false

    swap_module = true;             // Swap txns                               | true | false |
    add_liqudity_module = true;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = true;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    swap_all_balance = true;        // Use 100% of Balance                     | true | false |
    balancePercent = [5, 5];       // Random % of Balance                     | 1 | N |
    transactions_count = [2, 5];     // Txns Count                              | 1 | N |

    delay_txns = [20, 40];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC","APT/USDT"]
    pools_for_burn_lp = ["APT/USDC","APT/USDT"]
}

//________________________________________________ObricSwap________________________________________________\\

class ObricSwap {
                                     //                   MODULES
    add_liqudity_module = true;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = true;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    shuffle = false
    balancePercent = [2, 2];       // Random % of Balance                     | 1 | N |
    transactions_count = [2, 4];    // Txns Count                              | 1 | N |

    delay_txns = [10, 10];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC"]
    pools_for_burn_lp = ["APT/USDC"]
}


//________________________________________________Certus________________________________________________\\

class Certus {
//                   MODULES
    shuffle = false

    swap_module = true;             // Swap txns                               | true | false |
    add_liqudity_module = false;     // Add Liquidity Pools                     | true | false |
    burn_liqudity_module = false;    // Burn Liquidity Pools                    | true | false |
                                     //                  TXNS SETUP
    swap_all_balance = true;        // Use 100% of Balance                     | true | false |
    balancePercent = [5, 5];       // Random % of Balance                     | 1 | N |
    transactions_count = [1, 1];     // Txns Count                              | 1 | N |

    delay_txns = [10, 10];           // Delay between txns                      | 1 | N |
    pools_for_add_lp = ["APT/USDC","APT/USDT"]
    pools_for_burn_lp = ["APT/USDC","APT/USDT"]
}

//________________________________________________DittoStake________________________________________________\\

class DittoStake {
    //                   MODULES
    stake_module = true;            // Stake APT                               | true | false |
    unstake_module = true;
        //                  TXNS SETUP
    balancePercent = [10, 10];       // Random % of Balance                     | 1 | N |
    delay_txns = [10, 30];           // Delay between txns                      | 1 | N |
    shuffle = false
}

//________________________________________________TortugaStake________________________________________________\\

class TortugaStake {
    //                   MODULES
    stake_module = true;            // Stake APT                               | true | false |
    unstake_module = true;
        //                  TXNS SETUP
    unstake_instantly = true        // Unstake in 1 month or instantly         | true | false |
    balancePercent = [10, 10];       // Random % of Balance                     | 1 | N |
    delay_txns = [10, 30];           // Delay between txns                      | 1 | N |
    shuffle = false
}

class BlueMove {

    mint_module = true;
    sell_module = false;

    max_amount_to_buy = 0.19;
    delay_txns = [3, 5]
}

//________________________________________________GENERAL________________________________________________\\


module.exports = {
    OKX: new OKX(),
    AptosBridge: new AptosBridge(),
    LiquidSwap: new LiquidSwap(),
    AptoSwap: new AptoSwap(),
    PancakeSwap: new PancakeSwap(),
    AnimeSwap: new AnimeSwap(),
    AuxSwap: new AuxSwap(),
    ObricSwap: new ObricSwap(),
    General: new General(),
    Certus: new Certus(),
    ActiveModules: new ActiveModules(),
    DittoStake: new DittoStake(),
    TortugaStake: new TortugaStake(),
    BlueMove: new BlueMove(),
    AptosNames: new AptosNames()
}