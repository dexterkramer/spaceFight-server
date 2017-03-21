var squadFactory = require('./squad.js');

var oneFleat = function(name, player)
{
    this.name = name;
    this.squads = [];
    this.deployedSquad = [];
    this.player = player;
    player.fleat = this;
    this.capitalShip = null;
};

oneFleat.prototype = {
    addSquad : function(squad)
    {
        this.squads.push(squad);
    },
    addCapitalShip : function(squadJson)
    {
        this.capitalShip = squadFactory.createSquad(this, squadJson);
    },
    undeploySquad : function(squad)
    {
        this.deployedSquad.splice(this.deployedSquad.findIndex(function(elem){
            return elem == squad;
        }),1);
    },
    deploySquad : function(squad)
    {
        if(squad.case !== null)
        {
            this.deployedSquad.push(squad);
        }
        else
        {
            
        }
    },
    createFleatInfos : function(mask)
    {
        var fleatInfos = {};
        fleatInfos.name = this.name;
        if(mask.capitalShip)
        {
            fleatInfos.capitalShip = this.capitalShip.createSquadInfos(mask.capitalShip);
        }

        if(mask.deployedSquad)
        {
            fleatInfos.deployedSquad = [];
            this.deployedSquad.forEach(function(squad){
                fleatInfos.deployedSquad.push(squad.createSquadInfos(mask.deployedSquad));
            });
        }

        return fleatInfos;
    }
};

module.exports = {
    createFleat : function(player, fleatJson)
    {
        var fleat = new oneFleat(fleatJson.name, player);
        fleatJson.squads.forEach(function(squadJson){
            fleat.addSquad(squadFactory.createSquad(fleat, squadJson));
        });
        return fleat;
    }
}