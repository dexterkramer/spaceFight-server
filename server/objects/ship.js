var lifeBarFactory = require("./lifeBar.js");

var ship = function(infos)
{
    this.infos = infos;
    this.createLifeBar();
};

ship.prototype = {
    createLifeBar : function()
    {
        this.lifeBar = lifeBarFactory.create(this.infos.armor, this.infos.shield, this.infos.maxArmor);
    },
    attack : function(target, attackModifiers)
    {
        var firePower = this.infos.firePower;
        attackModifiers.forEach(function(attackModifier) {
            firePower = firePower * attackModifier.damageModifier;
        });
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
    }
};

module.exports = {
    createShip : function(infos)
    {
        return new ship(infos); 
    }
}