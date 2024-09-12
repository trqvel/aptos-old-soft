const { mint_module } = require("../../config").BlueMove;


async function Bluemove_main(aptos_key, accountIndex, logger, module_name) {

    if (mint_module) {
        const mint = await import('./mint.js');
        await mint.bluemove_mint(aptos_key, accountIndex, logger, module_name)
    }
}


module.exports = {
    Bluemove_main
}