var increaseLifeEffect = function(value)
{
    this.value = value;
    this.maxValue = value;
    this.bufferValue = value;
    this.squad = null;
    this.isApplyed = false;
    this.currentEffectIndex = null;
}

increaseLifeEffect.prototype = {
    applyEffect : function(squad)
    {
        if(this.isApplyed || squad == null || typeof squad == "undefined")
            return false;
        this.isApplyed = true;
        var ref = this;
        this.squad = squad;
        this.squad.ships.forEach(function(ship){
            // for now, ref.squad.ships.length will always be 1
            ship.lifeBar.setAdditionalLife( ref, ((ref.squad.ships.length > 0) ? (ref.value / ref.squad.ships.length) : 0) );
        });
        this.squad.addActiveEffect(this);
        return true;
    },
    bufferDamage : function(value)
    {
        this.bufferValue = (this.bufferValue - value > 0) ? this.bufferValue - value : 0;
    },
    applyDamage : function()
    {
        this.value = this.bufferValue;
    },
    removeEffect : function()
    {
        if(!this.isApplyed)
            return false;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.removeAdditionalLife(ref);
        });
        this.squad.removeActiveEffect(this);
        this.squad = null;
        return true;
    }
}

var increasePercentLifeEffect = function(value)
{
    this.value = value;
    this.maxValue = value;
    this.bufferValue = value;
    this.squad = null;
    this.isApplyed = false;
    this.currentEffectIndex = null;
}

increasePercentLifeEffect.prototype = {
    applyEffect : function(squad)
    {
        if(this.isApplyed || squad == null || typeof squad == "undefined")
            return false;
        this.isApplyed = true;
        var ref = this;
        this.squad = squad;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.setAdditionalLife( ref, (ref.value * (ship.lifeBar.armor + ship.lifeBar.getTotalAdditionalLife())));
        });
        this.squad.addActiveEffect(this);
        return true;
    },
    bufferDamage : function(value)
    {
        this.bufferValue -= value;
    },
    applyDamage : function()
    {
        this.value = this.bufferValue;
    },
    removeEffect : function()
    {
        if(!this.isApplyed)
            return false;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.removeAdditionalLife(ref);
        });
        this.squad.removeActiveEffect(this);
        this.squad = null;
        return true;
    }
}

var increaseDamageEffect = function(value)
{
    this.value = value;
    this.squad = null;
    this.isApplyed = false;
    this.currentEffectIndex = null;
}

increaseDamageEffect.prototype = {
    applyEffect : function(squad)
    {
        if(this.isApplyed || squad == null || typeof squad == "undefined")
            return false;
        this.isApplyed = true;
        var ref = this;
        this.squad = squad;
        this.squad.ships.forEach(function(ship){
            ship.setAdditionalDamage( ref, ((ref.squad.ships.length > 0) ? (ref.value / ref.squad.ships.length) : 0));
        });
        this.squad.addActiveEffect(this);
        return true;
    },
    removeEffect : function()
    {
        if(!this.isApplyed)
            return false;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.removeAdditionalDamage(ref);
        });
        this.squad.removeActiveEffect(this);
        this.squad = null;
        return true;
    }
};

var increasePercentDamageEffect = function(value)
{
    this.value = value;
    this.squad = null;
    this.isApplyed = false;
    this.currentEffectIndex = null;
}

increasePercentDamageEffect.prototype = {
    applyEffect : function(squad)
    {
        if(this.isApplyed || squad == null || typeof squad == "undefined")
            return false;
        this.isApplyed = true;
        var ref = this;
        this.squad = squad;
        this.squad.ships.forEach(function(ship){
            ship.setAdditionalDamage( ref, (ref.value * (ship.infos.firePower + ship.getTotalAdditionalDamage())));
        });
        this.squad.addActiveEffect(this);
        return true;
    },
    removeEffect : function()
    {
        if(!this.isApplyed)
            return false;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.removeAdditionalDamage(ref);
        });
        this.squad.removeActiveEffect(this);
        this.squad = null;
        return true;
    }
};
