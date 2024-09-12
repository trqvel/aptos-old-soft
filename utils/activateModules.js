const {AptoSwap,
    PancakeSwap,
    AnimeSwap,
    AuxSwap,
    ObricSwap,
    AptoStake,
    DittoStake,
    AptosNames,
    Souffl3,
    Topaz,
    General,
    Certus,
    Houston,
    BlueMove
}  = require('../config')

const { mainSwapFunction } = require('../modules/main_modules/swap')
const { mainAddLPFunction } = require('../modules/main_modules/addLP/index')
const {mainBurnLPFunction } = require('../modules/main_modules/burnLP/index.js')
const {mainStakeFunction} = require('../modules/main_modules/stake/index')
const { mainUnStakeFunction } = require('../modules/main_modules/unstake/index')
const {Bluemove_main} = require('../modules/bluemove/bluemove_main')
const {registerAptosName} = require('../modules/aptosnames/mintDomain')
const {
    withdraw_in_module,
    withdraw_out_module
} = require("../config").OKX;
const {
    registerModule
} = require("../config").AptosNames;
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function startModules(module_name, mmKey, pontemKey, okecx, addressIndex, logger){
    const { swap_module, add_liqudity_module, burn_liqudity_module, stake_module, unstake_module,shuffle } = require("../config")[module_name];

    let functions = [];
    try {
        if (swap_module === true && swap_module !== undefined) {
            functions.push(() => mainSwapFunction(pontemKey, logger, addressIndex, module_name));
        }

        if (module_name === 'BlueMove'){
            functions.push(() => Bluemove_main(pontemKey,addressIndex,logger,'BlueMove'));
        }

        if (module_name === 'AptosNames'){
            functions.push(() => registerAptosName(pontemKey,logger,addressIndex,'AptosNames'));
        }

        if (add_liqudity_module === true && add_liqudity_module !== undefined) {
            functions.push(() => mainAddLPFunction(pontemKey, logger, addressIndex, module_name));
        }

        if (burn_liqudity_module === true && burn_liqudity_module !== undefined) {
            functions.push(() => mainBurnLPFunction(pontemKey, logger, addressIndex, module_name));
        }

        if (stake_module === true && stake_module !== undefined) {
            functions.push(() => mainStakeFunction(pontemKey, logger, addressIndex, module_name));
        }

        if (unstake_module === true && unstake_module !== undefined) {
            functions.push(() => mainUnStakeFunction(pontemKey, logger, addressIndex, module_name));
        }

        if (shuffle === true && shuffle !== undefined) {
            functions = shuffleArray(functions);
        }

        for (let f of functions) {
            await f();
        }
    }catch (e) {
        console.log(e)
    }
}


 



module.exports = {
    startModules
}