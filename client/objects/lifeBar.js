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
    refreshDatas : function(infos)
    {
        this.armor = infos.armor;
        this.shield = infos.shield;
        this.maxArmor = infos.maxArmor;
        this.finalArmor = infos.finalArmor;
    },
    setAdditionalLife : function(from, value)
    {
        this.additionaleLifeArray.push({from : from, value : value, maxValue : value, finalValue : value});
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
        var lifeBarX = -50;
        var lifeBarY = 35;
        var lifeBarHeight = 8;
        var lifeBarWith = this.getLifeBarWith();
        var lifeBar = this.game.add.graphics(lifeBarX, lifeBarY);
        lifeBar.lineStyle(lifeBarHeight, this.getLifeBarColor());
        lifeBar.lineTo(lifeBarWith, 0);
        lifeBar.anchor.set(0, 0);
        var style = { font: "9px Arial",/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.game.add.text(lifeBarX, lifeBar.y - (lifeBarHeight / 2) - 3, (this.armor + this.getTotalAdditionalLife()) + "/" + (this.maxArmor + this.getTotalMaxAdditionalLife()), style);
        text.anchor.set(0 , 0);
        text.x = lifeBarX + ((lifeBarWith) / 2) - (text.width / 2);
        lifeBar.textObject = text;
        this.phaserObject = lifeBar;
        this.textObject = text;
    },
    getTotalAdditionalLife : function()
    {
        var total = 0;
        this.additionaleLifeArray.forEach(function(additionalLife){
            total += additionalLife.value;
        });
        return total;
    },
    getTotalMaxAdditionalLife : function()
    {
        var total = 0;
        this.additionaleLifeArray.forEach(function(additionalLife){
            total += additionalLife.maxValue;
        });
        return total;
    },
    getLifeBarWith : function()
    {
        var lifebarWidth = 100;
        var percent = this.armor / this.maxArmor; 
        return lifebarWidth * percent;
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