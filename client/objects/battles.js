var battle = function(attackingSquad, target)
{
    this.attackingSquad = attackingSquad;
    this.target = target;
    this.isProcessed = false;
    this.arrowPhaserObject = null;
}

battle.prototype = {

};

function createBattle(suqad, target)
{
    var theBattle = new battle(suqad, target);
    return theBattle;
}