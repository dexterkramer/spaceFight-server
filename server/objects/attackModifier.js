var AttackModifier = function(turns)
{
    this.damageModifier = 1;
    this.turns = turns;
    this.type = "AttackModifier";
}

AttackModifier.prototype = {
    setDamageModifier : function(damageModifier)
    {
        this.damageModifier = damageModifier;
    }
};

module.exports = {
    createDamageModifier : function(damageModifier, turns)
    {
        var attackModifier = new AttackModifier(turns);
        attackModifier.setDamageModifier(damageModifier);
        return attackModifier;
    }
}
