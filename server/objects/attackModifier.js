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
    },
    createAttackModifierInfos : function(mask)
    {
        var attackModifierInfos = {};
        if(mask.type)
        {
            attackModifierInfos.type = this.type;
        }
        if(mask.turns)
        {
            attackModifierInfos.turns = this.turns; 
        }
        if(mask.damageModifier)
        {
            attackModifierInfos.damageModifier = this.damageModifier;
        }
        return attackModifierInfos;
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
