var onePlayer = function(name, number, isMe)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
    this.number = number;
    this.availableCasePositioning = null;
    this.availableCaseDeploying = null;
    this.movesAllowed = 1;
    this.orders = [];
    this.availableOrders = [];
    this.cards = [];
    this.pick = [];
    this.isMe = isMe;
};

onePlayer.prototype = {
    /*createPick : function()
    {
        this.pick = createPick(this);
    },*/
    resetSquadsActions : function()
    {
        this.movesAllowed = 1;
        this.fleat.deployedSquad.forEach(function(squad){
            squad.movesAllowed = 1;
            squad.tempAction = null;
            squad.action = null;
            squad.movedFrom = [];
            //squad.defendAgainst = [];
        });
    },
    resetEffects : function()
    {
        this.fleat.squads.forEach(function(squad){
            squad.resetModifiers();
        });
    },
    okToFinishPositioning : function()
    {
        if(this.fleat.capitalShip.case == null)
            return false;
        return true;
    },
    disableDragingAllSquads : function()
    {
        this.fleat.deployedSquad.forEach(function(squad){
            if(squad.phaserObject != null)
            {
                squad.phaserObject.input.disableDrag();
            }
        });
    },
    drawAllSquads : function()
    {
        this.fleat.deployedSquad.forEach(function(squad){
            squad.draw();
        });   
    }
};