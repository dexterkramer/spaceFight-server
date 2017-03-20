var lifeBar = function(armor, shield, maxArmor)
{
    //this.startArmor = armor;
    this.armor = armor;
    this.startShield = shield;
    this.shield = shield;
    this.tempArmor = armor;
    this.maxArmor = maxArmor;
    this.finalArmor = armor;
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