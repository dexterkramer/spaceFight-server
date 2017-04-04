var TheGame = function(game){
    this.game = game;
};
  
TheGame.prototype = {
  	create: function(){
        //this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.turn.number = 0;
        this.game.battles = [];
        this.game.looser = [];
        this.game.eliminatedPlayers = [];
        this.game.infos = { tourInfos : null};
        this.game.battleInfos = null;
        nextTurn();
      },
    update : function(){

    }
}

//////////////////////////////////////////////////////////////////
////////////////////////// GAME MECHANICS ////////////////////////
//////////////////////////////////////////////////////////////////

function checkLoosers()
{
    if(this.game.looser.length > 0)
    {
        var ref = this;
        var i;
        var initLenght = this.game.players.length;
        for(i = 0; i < initLenght; i++)
        {
            var looserIndex = this.game.players.findIndex(function(elem){
                return ref.game.looser.indexOf(elem) != -1;
            });
            if(looserIndex != -1)
            {
                this.game.eliminatedPlayers.push(this.game.players[looserIndex]);
                this.game.players.splice(looserIndex, 1);
            }
        }
        if(this.game.players.length <= 1)
        {
            finishGame();
        }
    }
}

function finishGame()
{
    refreshInfos();
    if(this.game.players.length == 1)
    {

    }
    this.game.eliminatedPlayers.forEach(function(player){

    });
}

function refreshInfos()
{
    if(this.game.infos.tourInfos != null && this.game.infos.tourInfos.phaserObject != null)
    {
        this.game.infos.tourInfos.phaserObject.destroy();
    }
    if(this.game.players.length <= 1)
    {
        if(this.game.players.length == 1)
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = this.game.turn.player.name+ " win the game !";
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
        }
        else
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = "DRAW !";
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
        }
    }
    else
    {
        if(this.game.turn.player != null)
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = " Turn : " + this.game.turn.player.name;
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
        }
    }
}

function nextTurn()
{
    this.game.battles = [];
    if(this.game.turn.player !== null)
    {

    }
    this.game.turn.number++;
    if(this.game.turn.player != null)
    {
        this.game.turn.player.resetEffects();
    }
    nextPlayer();
    refreshInfos();
    this.game.turn.player.resetSquadsActions();
    this.game.turn.player.drawOneCard();
}

function loose(player)
{
    this.game.looser.push(player);
}

///////////////////////////////////////////////////////////
///////////////////// DRAG AND OVERLAP ////////////////////
///////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
/////////////////////////// ATTACK ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function attack(squad, target)
{
    // don't move the squad to the case (attack the ennemy squad instead)
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }
    squad.action = addBattle(squad, target);
    target.action = addBattle(target, squad);

    squad.initFinalArmor();
    target.initFinalArmor();
    var modifiers = [];
    var toFriendlyFires = squad.getFriendlyFire(target);
    squad.applyFriendlyFire(toFriendlyFires);
    if(toFriendlyFires.length > 0)
    {
        modifiers.push(createDamageModifier(1-(toFriendlyFires.length/10),1));
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

function getDefendingAgainst(defendingSquad)
{
    var defendingAgainst = [];
    this.game.battles.forEach(function(battle){
        if(battle.target == defendingSquad)
        {
            defendingAgainst.push(battle);
        }
    });
    return defendingAgainst;
}

function addBattle(attackingSquad, target)
{
    var theBattle = createBattle(attackingSquad, target);
    this.game.battles.push(theBattle);
    return theBattle;
}

function removeBattle(battle)
{
    if(battle.arrowPhaserObject != null)
    {
        battle.arrowPhaserObject.destroy();
    }
    this.game.battles.splice(this.game.battles.findIndex(function(elem){
        return elem == battle;
    }),1);
}

function findBattle(attackingSquad)
{
    var index = this.game.battles.findIndex(function(elem){
        return elem.attackingSquad == attackingSquad;
    });
    if(typeof index == "undefined" || index == null || index == -1)
    {
        return false;
    }
    return this.game.battles[index];
}



////////////////////////////////////////////
///////////////// MOVE /////////////////////
////////////////////////////////////////////

function move(sprite)
{
    if(sprite.ref.movedFrom[sprite.ref.movedFrom.length - 1] == sprite.ref.overlapedCase)
    {
        if(sprite.ref.case !== null)
        {
            sprite.ref.case.squad = null;
        }
        sprite.ref.movesAllowed = sprite.ref.movesAllowed + 1;
        sprite.ref.movedFrom.pop();
        sprite.ref.applyMove();
        return true;
    }
    else if (sprite.ref.movesAllowed > 0)
    {
        
        sprite.ref.movesAllowed--;
        sprite.ref.movedFrom.push(sprite.ref.case);
        sprite.ref.applyMove();
        return true;
    }
    else
    {
        if(sprite.ref.case !== null)
        {
            sprite.x = sprite.ref.case.phaserObject.middleX;
            sprite.y = sprite.ref.case.phaserObject.middleY;
        }
    }
    return false;
}

////////////////////////////////////////////
///////////////// SUPPORT //////////////////
////////////////////////////////////////////

function support(squad, target)
{
    // go here if the squad is moved to a case already countaining a fleet.
    // if the esouade had already a case : get back to the previous case.
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }

    // stop if the squad have already made an action this turn
    if(squad.action != null)
    {
        return false;
    }
    
    squad.support(target);
    target.updateLifeBar();
    target.drawLifeBar(this.game);
    squad.action = new action("support", target);
    return true;
}