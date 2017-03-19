var fleatFactory = require('./fleat.js');
var orderFactory = require('./order.js');
var pickFactory = require('./pick.js'); 
var handlerFactory = require('./cardHandler.js');

var onePlayer = function(name, number, availableCasePositioning, availableCaseDeploying)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
    this.number = number;
    this.availableCasePositioning = availableCasePositioning;
    this.availableCaseDeploying = availableCaseDeploying;
    this.movesAllowed = 1;
    this.orders = [];
    this.availableOrders = [];
    this.cardHandlers = [];
    this.pick = [];
    this.conn = null;
    this.createHandlers();
};

onePlayer.prototype = {
    createPick : function()
    {
        this.pick = pickFactory.createPick(this);
    },
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
    drawOneCard : function()
    {
        var card = this.pick.drawOne();
        if(!card)
        {
            return false;
        }
        var index = this.cardHandlers.findIndex(function(elem){
            return elem.card == null;
        });
        if(typeof index != "undefined" && index != null && index != -1)
        {
            var choosenHandler = this.cardHandlers[index];
            card.setHandler(choosenHandler);
            choosenHandler.addCard(card);
        }
    },
    createHandlers : function()
    {
        //console.log(utils);
        this.cardHandlers = handlerFactory.createHandlers(this);
    }
};

module.exports = {
    createPlayer : function(playerJson, number, availableCasePositioning, availableCaseDeploying)
    {
        var player = new onePlayer(playerJson.name, number, availableCasePositioning, availableCaseDeploying);
        player.conn = playerJson.conn;
        player.fleat = fleatFactory.createFleat(player, playerJson.fleat );
        player.orders = orderFactory.createOrders(player, playerJson.orders);
        player.fleat.addCapitalShip(playerJson.fleat.capitalShip);
        player.createPick();
        return player;
    }
}