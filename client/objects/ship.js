var ship = function(infos, currentShipIndex)
{
    this.infos = infos.infos;
    this.lifeBarInfos = infos.lifeBar;
    this.currentShipIndex = infos.currentShipIndex;
    this.additionalFirePowerArray = [];
    this.createLifeBar();
};

ship.prototype = {
    refreshDatas : function(infos)
    {
        this.infos = infos.infos;
        this.lifeBarInfos = infos.lifeBar;
        this.currentShipIndex = infos.currentShipIndex;
        this.lifeBar = null;
        this.createLifeBar();
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
    createLifeBar : function()
    {
        this.lifeBar = createLifeBar(this.game, this.lifeBarInfos.armor, this.lifeBarInfos.shield, this.lifeBarInfos.maxArmor);
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