var captain = function(player, name, effects)
{
    //this.player = player;
    this.name = name;
    this.effects = effects;
    this.squad = null;
}

captain.prototype = {
    init : function()
    {
        if(this.squad != null)
        {
            
        }
    },
    setSquad : function(squad)
    {
        this.squad = squad;
    },
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
    createCaptain : function(player, name, effects)
    {
        var theCaptain = new captain(player, name, effects);
        return theCaptain;
    },
    createCaptains : function(player, captainsJson)
    {
        var ref = this;
        var captainsArray = [];
        captainsJson.forEach(function(c){
            captainsArray.push(ref.createCaptain(player, c.name, c.effects));
        });
        return captainsArray;
    }
}