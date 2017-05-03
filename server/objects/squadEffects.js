var increaseLifeEffect = function(value)
{
    this.value = value;
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
    createEffectInfos : function(mask)
    {   
        var effectInfos = {};
        if(mask.type)
        {
            effectInfos.type = "lifePoint";
            effectInfos.valueType = "absolute";
        }
        if(mask.value)
        {
            effectInfos.value = this.value;
        }
        if(mask.isApplyed)
        {
            effectInfos.isApplyed = this.isApplyed;
        }
        effectInfos.currentEffectIndex = this.currentEffectIndex;
        return effectInfos;
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
    createEffectInfos: function(mask)
    {   
        var effectInfos = {};
        if(mask.type)
        {
            effectInfos.type = "lifePoint";
            effectInfos.valueType = "relative";
        }
        if(mask.value)
        {
            effectInfos.value = this.value;
        }
        if(mask.isApplyed)
        {
            effectInfos.isApplyed = this.isApplyed;
        }
        effectInfos.currentEffectIndex = this.currentEffectIndex;
        return effectInfos;
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
    createEffectInfos: function(mask)
    {   
        var effectInfos = {};
        if(mask.type)
        {
            effectInfos.type = "damage";
            effectInfos.valueType = "absolute";
        }
        if(mask.value)
        {
            effectInfos.value = this.value;
        }
        if(mask.isApplyed)
        {
            effectInfos.isApplyed = this.isApplyed;
        }
        effectInfos.currentEffectIndex = this.currentEffectIndex;
        return effectInfos;
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
    createEffectInfos: function(mask)
    {   
        var effectInfos = {};
        if(mask.type)
        {
            effectInfos.type = "damage";
            effectInfos.valueType = "relative";
        }
        if(mask.value)
        {
            effectInfos.value = this.value;
        }
        if(mask.isApplyed)
        {
            effectInfos.isApplyed = this.isApplyed;
        }
        effectInfos.currentEffectIndex = this.currentEffectIndex;
        return effectInfos;
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


module.exports = {
    createSquadEffect : function(effectJson)
    {
        var squadEffect = null;
        if(effectJson.type == "lifePoint")
        {
            if(effectJson.valueType == "absolute")
            {
                squadEffect = new increaseLifeEffect(effectJson.value);
            }
            else if(effectJson.valueType == "relative")
            {
                squadEffect = new increasePercentLifeEffect(effectJson.value);
            }
        }
        else if(effectJson.type == "damage")
        {
            if(effectJson.valueType == "absolute")
            {
                squadEffect = new increaseDamageEffect(effectJson.value);
            }
            else if(effectJson.valueType == "relative")
            {
                squadEffect = new increasePercentDamageEffect(effectJson.value);
            }
        } 
        return squadEffect;
    }
}