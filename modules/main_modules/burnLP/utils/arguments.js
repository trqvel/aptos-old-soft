async function setupArgumentsAnimeSwap(balance,toAmountVal){
    const balanceWithSlipp = BigInt(balance) - (BigInt(balance) * BigInt(5)/BigInt(100))
    
    return [balance,balanceWithSlipp,toAmountVal]

}

module.exports = {
    setupArgumentsAnimeSwap
}