var increaseLifeEffect = function(value, squad)
{
    this.value = value;
    this.squad = squad;
    this.isApplyed = false;
}

increaseLifeEffect.prototype = {
    applyEffect : function()
    {
        this.isApplyed = true;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            // for now, ref.squad.ships.length will always be 1
            ship.lifeBar.setAdditionalLife( ref, ((ref.squad.ships.length > 0) ? (ref.value / ref.squad.ships.length) : 0) );
        });
    },
    removeEffect : function()
    {
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.removeAdditionalLife(ref);
        });
    }
}

var increasePercentLifeEffect = function(value, squad)
{
    this.value = value;
    this.squad = squad;
    this.isApplyed = false;
}

increasePercentLifeEffect.prototype = {
    applyEffect : function()
    {
        this.isApplyed = true;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.setAdditionalLife( ref, (ref.value * (ship.lifeBar.armor + ship.lifeBar.getTotalAdditionalLife())));
        });
    },
    removeEffect : function()
    {
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.removeAdditionalLife(ref);
        });
    }
}

var increaseDamageEffect = function(value, squad)
{
    this.value = value;
    this.squad = squad;
    this.isApplyed = false;
}

increaseDamageEffect.prototype = {
    applyEffect : function()
    {
        this.isApplyed = true;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.setAdditionalDamage( ref, ((ref.squad.ships.length > 0) ? (ref.value / ref.squad.ships.length) : 0));
        });
    },
    removeEffect : function()
    {
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.removeAdditionalDamage(ref);
        });
    }
};

var increasePercentDamageEffect = function(value, squad)
{
    this.value = value;
    this.squad = squad;
    this.isApplyed = false;
}

increasePercentDamageEffect.prototype = {
    applyEffect : function()
    {
        if(!this.isApplyed)
        {
            this.isApplyed = true;
            var ref = this;
            this.squad.ships.forEach(function(ship){
                ship.setAdditionalDamage( ref, (ref.value * (ship.infos.firePower + ship.getTotalAdditionalDamage())));
            });
        }
    },
    removeEffect : function()
    {
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.removeAdditionalDamage(ref);
        });
    }
};

module.exports = {
    createSquadEffect : function(squad, effectJson)
    {
        var squadEffect = null;
        if(effectJson.type == "lifePoint")
        {
            if(effectJson.valueType == "absolute")
            {
                squadEffect = new increaseLifeEffect(effectJson.value, squad);
            }
            else if(effectJson.valueType == "relative")
            {
                squadEffect = new increasePercentLifeEffect(effectJson.value, squad);
            }
        }
        else if(effectJson.type == "damage")
        {
            if(effectJson.valueType == "absolute")
            {
                squadEffect = new increaseDamageEffect(effectJson.value, squad);
            }
            else if(effectJson.valueType == "relative")
            {
                squadEffect = new increasePercentDamageEffect(effectJson.value, squad);
            }
        } 
        return squadEffect;
    }
}