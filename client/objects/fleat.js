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
        this.capitalShip = createSquad(this.game, this, squadJson);
    },
    undeploySquad : function(squad)
    {
        this.deployedSquad.splice(this.deployedSquad.findIndex(function(elem){
            return elem == squad;
        }),1);
        squad.disableDrag();
        squad.remove();
    },
    deploySquad : function(squad)
    {
        squad.draw();
        this.deployedSquad.push(squad);
    }
};