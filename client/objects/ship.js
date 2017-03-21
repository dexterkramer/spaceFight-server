var ship = function(infos)
{
    this.infos = infos.infos;
    this.lifeBarInfos = infos.lifeBar;
    this.createLifeBar();
};

ship.prototype = {
    createLifeBar : function()
    {
        this.lifeBar = new lifeBar(this.lifeBarInfos.armor, this.lifeBarInfos.shield, this.lifeBarInfos.maxArmor);
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