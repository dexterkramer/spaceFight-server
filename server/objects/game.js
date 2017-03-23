var playerMask = require("./../infosMasks/playerInfosMask.js");
var ennemyMask = require("./../infosMasks/ennemyInfosMask.js");
var attackModifierFactory = require("./attackModifier.js");
var battleFactory = require("./battles.js");

var Game = function()
{
    this.caseTable = [];
    this.players = [];
    this.battles = [];
    this.state = null;
    this.turn = { number : 0, player : null};
}

Game.prototype = {
    launchGame : function()
    {
        this.state = "positioning";
        var playersInfos = this.createPlayersInfos();
        var ennemyInfos = this.createEnnemyInfos();
        this.players.forEach(function(player, index){
            var toSendPlayersInfos = {};
            toSendPlayersInfos.players = [];
            toSendPlayersInfos.players[index] = playersInfos[index];
            toSendPlayersInfos.index = index;
            ennemyInfos.forEach(function(ennemy,indexEnnemy){
                if(index != indexEnnemy)
                {
                    ennemy.index = indexEnnemy;
                    toSendPlayersInfos.players[indexEnnemy] = ennemy;
                }
            });
            player.remote.sendPlayersInfos(toSendPlayersInfos, player.playerId);
        });
    },
    getDefendingAgainst : function(defendingSquad)
    {
        var defendingAgainst = [];
        this.battles.forEach(function(battle){
            if(battle.target == defendingSquad)
            {
                defendingAgainst.push(battle);
            }
        });
        return defendingAgainst;
    },
    addBattle : function(squad, target)
    {
        var theBattle = battleFactory.createBattle(squad, target);
        this.battles.push(theBattle);
        return theBattle;
    },
    move : function(currentDeployedIndex, playerSquad, caseIndex)
    {
        var squadIndex = playerSquad.fleat.deployedSquad.findIndex(function(elem){
            return elem.currentDeployedIndex == currentDeployedIndex;
        });
        var squad = playerSquad.fleat.deployedSquad[squadIndex];
        if(squad.action == null)
        {
            if(squad.canGo(this.caseTable[caseIndex]))
            {
                var target = this.caseTable[caseIndex].squad;
                if(typeof target != "undefined" && target != null)
                {   
                    if(target.fleat.player != squad.fleat.player)
                    {
                        squad.action = this.addBattle(squad, target);
                        target.action = this.addBattle(target, squad);
                        squad.initFinalArmor();
                        target.initFinalArmor();
                        var modifiers = [];
                        var toFriendlyFires = squad.getFriendlyFire(target, this.getDefendingAgainst(target));
                        squad.applyFriendlyFire(toFriendlyFires);
                        if(toFriendlyFires.length > 0)
                        {
                            modifiers.push(attackModifierFactory.createDamageModifier(1-(toFriendlyFires.length/10),1));
                        }
                        var flankBonus = squad.calcultateFlankingBonus(target);
                        if(flankBonus)
                        {
                            modifiers.push(flankBonus);
                        }
                        squad.attack(target, modifiers);
                        target.attack(squad,  []);
                        target.applyDamages();
                        squad.applyDamages();
                        squad.updateLifeBar();
                        target.updateLifeBar();
                        if(target.lifeBar.armor <= 0)
                        {
                            target.removeFromBattle();
                        }
                        if(squad.lifeBar.armor <= 0)
                        {
                            squad.removeFromBattle();
                        }
                    }
                }
                else
                {
                    if(squad.movedFrom[squad.movedFrom.length - 1] == this.caseTable[caseIndex])
                    {
                        if(squad.case !== null)
                        {
                            squad.case.squad = null;
                        }
                        squad.movesAllowed = squad.movesAllowed + 1;
                        squad.movedFrom.pop();
                        squad.case = this.caseTable[caseIndex];
                        squad.case.squad = squad;
                    }
                    else if (sprite.ref.movesAllowed > 0)
                    {
                        if(squad.case !== null)
                        {
                            squad.case.squad = null;
                        }
                        squad.movesAllowed--;
                        squad.movedFrom.push(sprite.ref.case);
                        squad.case = this.caseTable[caseIndex];
                        squad.case.squad = squad;
                    }
                }
            }
        }
        this.refreshPlayersInfos();
    },
    nextTurn : function(id)
    {
        this.turn.player.resetEffects();
        var indexChoose = 0;
        var self = this;
        var playerIndex = this.players.findIndex(function(elem){
            return elem == self.turn.player;
        });
        if((playerIndex + 1) < this.players.length)
        {
            indexChoose = playerIndex + 1;
        }
        else
        {
            indexChoose = 0;
        }
        this.turn.player = this.players[indexChoose];
        this.turn.player.resetSquadsActions();
        return indexChoose;
    },
    gamePhase : function()
    {
        this.state = "game";
        if(this.turn.player == null)
        {
            this.turn.player = this.players[0];
        }
        return true;
    },
    refreshPlayersInfos : function()
    {
        var playersInfos = this.createPlayersInfos();
        var ennemyInfos = this.createEnnemyInfos();
        this.players.forEach(function(player, index){
            var toSendPlayersInfos = {};
            toSendPlayersInfos.players = [];
            toSendPlayersInfos.players[index] = playersInfos[index];
            toSendPlayersInfos.index = index;
            ennemyInfos.forEach(function(ennemy,indexEnnemy){
                if(index != indexEnnemy)
                {
                    ennemy.index = indexEnnemy;
                    toSendPlayersInfos.players[indexEnnemy] = ennemy;
                }
            });
            player.remote.refreshPlayersInfos(toSendPlayersInfos);
        });
    },
    nextPlayer : function(rewind)
    {
        if(this.turn.player == null)
        {
            if(typeof this.players[0] !== "undefined" && this.players[0] !== null)
            {
                this.turn.player = this.players[0];
            }        
            return this.turn.player;
        }
        if(typeof this.players[this.turn.player.number + 1] !== "undefined" && this.players[this.turn.player.number + 1] !== null)
        {
            this.turn.player = this.players[this.turn.player.number + 1];
        }
        else
        {
            if(typeof rewind == "undefined" || rewind == true)
            {
                this.turn.player = this.players[0];
            }
            else
            {
                this.turn.player = null;
            }
        }
        return this.turn.player;
    },
    createEnnemyInfos : function()
    {
        var ennemyInfos = [];
        this.players.forEach(function(player, index){
            var ennemyInfo = {};
            ennemyInfo = player.createPlayerInfos(ennemyMask);
            ennemyInfos.push(ennemyInfo);
        });
        return ennemyInfos;
    },
    createPlayersInfos : function()
    {
        var playersInfos = [];
        this.players.forEach(function(player, index){
            var playerInfos = {};
            playerInfos = player.createPlayerInfos(playerMask);
            playersInfos.push(playerInfos);
        });
        return playersInfos;
    }
};

module.exports = Game;
