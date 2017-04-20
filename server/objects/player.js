var fleatFactory = require('./fleat.js');
var orderFactory = require('./order.js');
var pickFactory = require('./pick.js'); 
var captainFactory = require('./captain.js');

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
    this.cards = [];
    this.pick = [];
    this.conn = null;
    this.currentCardIndex = 0;
    this.loose = false;
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
        if(this.cards.length < 10)
        {
            var card = this.pick.drawOne();
            if(!card)
            {
                return false;
            }
            
            card.currentCardIndex = this.currentCardIndex;
            this.currentCardIndex++;
            this.cards.push(card);
        }
    },
    createPlayerInfos : function(mask)
    {
        var playerInfos = {};
        playerInfos.name = this.name;
        if(mask.fleat)
            playerInfos.fleat = this.fleat.createFleatInfos(mask.fleat);
        if(mask.cards)
        {
            playerInfos.cardsInfos = [];
            this.cards.forEach(function(card){
                playerInfos.cardsInfos.push(card.createCardInfos(mask.cards));
            });
        }

        return playerInfos;
    },
    createEnnemyInfos : function()
    {
        
    }
};

module.exports = {
    createPlayer : function(playerJson, number, availableCasePositioning, availableCaseDeploying)
    {
        var player = new onePlayer(playerJson.name, number, availableCasePositioning, availableCaseDeploying);
        player.remote = playerJson.remote;
        player.playerId = playerJson.playerId;
        player.fleat = fleatFactory.createFleat(player, playerJson.fleat );
        player.orders = orderFactory.createOrders(player, playerJson.orders);
        player.captains = captainFactory.createCaptains(player, playerJson.captains );
        player.fleat.addCapitalShip(playerJson.fleat.capitalShip);
        player.createPick();
        return player;
    }
}