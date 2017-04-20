var captain = function(player, name, effects)
{
    //this.player = player;
    this.name = name;
    this.effects = effects;
}

captain.prototype = {
    createCaptainInfos : function(mask)
    {
        var captainInfos = {};
        if(mask.name)
        {
            captainInfos.name = captain.name;
        }
        if(mask.effects)
        {
            captainInfos.effects = captain.effects;
        }
        return captainInfos;
    }
};

module.exports = {
    creatCaptain : function(player, name, effects)
    {
        var theCaptain = new captain(player, name, effects);
        return theCaptain;
    },
    createCaptains : function(player, captainsJson)
    {
        var ref = this;
        var captainsArray = [];
        captainsJson.forEach(function(c){
            captainsArray.push(ref.creatCaptain(player, c.name, c.effects));
        });
        return captainsArray;
    }
}