var lifeBar = function(armor, shield, maxArmor)
{
    //this.startArmor = armor;
    this.armor = armor;
    this.startShield = shield;
    this.shield = shield;
    this.tempArmor = armor;
    this.maxArmor = maxArmor;
    this.finalArmor = armor;
    this.additionaleLifeArray = [];
}

lifeBar.prototype = {
    setArmor : function(armor)
    {
        this.armor = armor;
    },
    setShield : function(shield)
    {
        this.shield = shield;
    },
    setAdditionalLife : function(from, value)
    {
        this.additionaleLifeArray.push({from : from, value : value, maxValue : value});
    },
    removeAdditionalLife : function(from)
    {
        var index = this.additionaleLifeArray.findIndex(function(additionalLife){
            return additionalLife.from == from;
        });
        if(index != -1)
        {
            this.additionaleLifeArray.splice(index, 1);
        }
    },
    shoot : function(firePower)
    {
        var firePowerLeft = firePower;
        while(firePowerLeft > 0 && this.armor > 0)
        {
            this.additionaleLifeArray.forEach(function(additionalLife){
                if(additionalLife.value > 0)
                {
                    let previousValue = additionalLife.value;
                    additionalLife.value = (previousValue - firePowerLeft > 0) ? previousValue - firePowerLeft : 0;
                    firePowerLeft = firePowerLeft - previousValue;
                }
            });
            if(firePowerLeft > 0)
            {
                this.armor = (this.armor - firePowerLeft > 0) ? this.armor - firePowerLeft : 0;
            }
        }
    },
    getTotalAdditionalLife : function()
    {
        var total = 0;
        this.additionaleLifeArray.forEach(function(additionalLife){
            total += additionalLife.value;
        });
        return total;
    },
    createLifeBarInfos : function(mask){
        var lifeBarInfos = {};
        if(mask.armor)
        {
            lifeBarInfos.armor = this.armor;
        }
        if(mask.shield)
        {
            lifeBarInfos.shield = this.shield;
        }
        if(mask.maxArmor)
        {
            lifeBarInfos.maxArmor = this.maxArmor;
        }
        if(mask.finalArmor)
        {
            lifeBarInfos.finalArmor = this.finalArmor;
        }
        return lifeBarInfos;
    }
};

module.exports = {
    create : function(armor, shield, maxArmor)
    {
       return new lifeBar(armor, shield, maxArmor);
    }
}