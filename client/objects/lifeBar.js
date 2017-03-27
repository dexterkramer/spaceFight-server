var lifeBar = function(armor, shield, maxArmor)
{
    this.armor = armor;
    this.startShielf = shield;
    this.shield = shield;
    this.phaserObject = null;
    this.textObject = null;
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
    refreshDatas : function(infos)
    {
        this.armor = infos.armor;
        this.shield = infos.shield;
        this.maxArmor = infos.maxArmor;
        this.finalArmor = infos.finalArmor;
    },
    draw : function()
    {
        if(this.phaserObject !== null)
        {
            this.phaserObject.destroy();
        }
        if(this.textObject !== null)
        {
            this.textObject.destroy();
        }
        var lifeBarPhaser = drawLifeBar(this);
        this.phaserObject = lifeBarPhaser;
        this.textObject = lifeBarPhaser.textObject;
        return lifeBarPhaser;
    },
    getLifeBarColor : function()
    {
        var percent = this.armor / this.maxArmor; 
        var color = 0xEC2727;
        if(percent > 0.2 )
        {
            color = 0xEC7C27;
        }
        if(percent > 0.4)
        {
            color = 0xECDF27;
        }
        if(percent > 0.6)
        {
            color = 0x9AEC27;
        }
        if(percent > 0.8)
        {
            color = 0x4BEC27;
        }
        return color;
    }
};