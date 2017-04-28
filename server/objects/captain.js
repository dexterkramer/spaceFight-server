var captain = function(player, name, effects)
{
    //this.player = player;
    this.name = name;
    this.effects = effects;
    this.squad = null;
    this.currentCaptainIndex = null;
}

captain.prototype = {
    init : function()
    {
        if(this.squad != null)
        {
            this.squad.buff(this.effects);
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
            captainInfos.name = this.name;
        }
        if(mask.effects)
        {
            captainInfos.effects = this.effects;
        }
        captainInfos.currentCaptainIndex = this.currentCaptainIndex;
        return captainInfos;
    }
};

module.exports = {
    createCaptain : function(player, name, effects, currentCaptainIndex)
    {
        var theCaptain = new captain(player, name, effects);
        theCaptain.currentCaptainIndex = currentCaptainIndex;
        return theCaptain;
    },
    createCaptains : function(player, captainsJson)
    {
        var ref = this;
        var captainsArray = [];
        captainsJson.forEach(function(c){
            captainsArray.push(ref.createCaptain(player, c.name, c.effects, player.currentCaptainIndex));
            player.currentCaptainIndex += 1;
        });
        return captainsArray;
    }
}