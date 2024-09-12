const { TokensMapping } = require("../../../../utils/common")

async function setupTypeArgumentsPancakeSwap(src,dst){
    return [TokensMapping.src,TokensMapping.dst]
}

async function setupTypeArgumentsAuxSwap(){
    
}

module.exports = {
    setupTypeArgumentsPancakeSwap,
    setupTypeArgumentsAuxSwap
}