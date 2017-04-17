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

