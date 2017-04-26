var lifeBarFactory = require("./lifeBar.js");

var ship = function(infos)
{
    this.infos = infos;
    this.lifeBar = null;
    this.currentShipIndex = null;
    this.additionalFirePowerArray = [];
    this.createLifeBar();
};

ship.prototype = {
    createLifeBar : function()
    {
        this.lifeBar = lifeBarFactory.create(this.infos.armor, this.infos.shield, this.infos.maxArmor);
    },
    setAdditionalDamage : function(from, value)
    {
        this.additionalFirePowerArray.push({from : from, value : value});
    },
    removeAdditionalDamage : function(from)
    {
        var index = this.additionalFirePowerArray.findIndex(function(additionalFirePower){
            return additionalFirePower.from == from;
        });
        if(index != -1)
        {
            this.additionalFirePowerArray.splice(index, 1);
        }
    },
    createShipInfos : function(mask)
    {
        var shipInfos = {};
        if(mask.infos)
        {
            shipInfos.infos = this.infos;
        }
        if(mask.lifeBar)
        {
            shipInfos.lifeBar = this.lifeBar.createLifeBarInfos(mask.lifeBar);
        }
        shipInfos.currentShipIndex = this.currentShipIndex;
        return shipInfos;
    },
    attack : function(target, attackModifiers)
    {
        var firePower = this.infos.firePower;
        attackModifiers.forEach(function(attackModifier) {
            firePower = firePower * attackModifier.damageModifier;
        });

        /*var firePower =  this.infos.firePower + this.getTotalAdditionalDamage();

        target.lifeBar.shoot(firePower);*/

        target.lifeBar.tempArmor -= firePower;
        target.lifeBar.finalArmor -= firePower;
        if(target.lifeBar.tempArmor < 0)
        {
            target.lifeBar.tempArmor = 0;
        }
        if(target.lifeBar.finalArmor < 0)
        {
            target.lifeBar.finalArmor = 0;
        }
    },
    getTotalAdditionalDamage : function()
    {
        var total = 0;
        this.additionalFirePowerArray.forEach(function(additionalFirePower){
            total += additionalFirePower.value;
        });
        return total;
    }
};

module.exports = {
    createShip : function(infos)
    {
        return new ship(infos); 
    }
}