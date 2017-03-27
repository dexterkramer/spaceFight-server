var TheGame = function(game){
};
  
TheGame.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.turn.number = 0;
        this.game.battles = [];
        this.game.infos = { tourInfos : null};
        this.game.battleInfos = null;
        this.game.refreshing = false;
        this.game.end = 0;
        this.game.winner = null;
        this.game.draw = false;
        drawCases();
        drawAllCards();
        drawAllSquads();
        this.game.server.okToGame(this.game.client.id);
        button = this.game.add.button(600, 600, 'button', nextTurn, this, 1, 0, 1);
      },
    update : function(){
        checkEnd();
        if(this.game.turn.player == this.game.me)
        {
            this.game.caseTable.forEach(function(oneCase){
                oneCase.NotOverLaped();
            });
            checkOverLapSquad(this.game.me,this.game.caseTable, OverLapGamingDraggingManagment);
            checkOverLapCard(this.game.me,this.game.caseTable, this.game.me.availableCaseDeploying, OverLapGamingCardDraggingManagment);
        }
    }
}

//////////////////////////////////////////////////////////////////
////////////////////////// GAME MECHANICS ////////////////////////
//////////////////////////////////////////////////////////////////

function refreshPlayers()
{
    this.game.players.forEach(function(player, index){
        ////////////// refresh squads /////////////////////////
        player.fleat.deployedSquad.forEach(function(squad){
            squad.toClean = true;
        });
        this.game.tempPlayerInfos.players[index].fleat.deployedSquad.forEach(function(squadJson, indexTemp){
            let squadIndex = player.fleat.deployedSquad.findIndex(function(elem){
                return elem.currentDeployedIndex == squadJson.currentDeployedIndex;
            });
            if(squadIndex != -1 )
            {
                player.fleat.deployedSquad[squadIndex].toClean = false;
                player.fleat.deployedSquad[squadIndex].refreshDatas(squadJson, this.game.caseTable);
            }
            else
            {
                var newSquad = createSquad( player.fleat, squadJson);
                newSquad.toClean = false;
                newSquad.case = this.game.caseTable[squadJson.case.number];
                newSquad.case.squad = newSquad;
                player.fleat.deploySquad(newSquad);
            }
        });
        var toCleanArray = [];
        player.fleat.deployedSquad.forEach(function(squad, index){
            if(squad.toClean)
            {
                toCleanArray.push(index);
            }
        });
        toCleanArray.forEach(function(indexToRemove){
            player.fleat.undeploySquad(player.fleat.deployedSquad[indexToRemove]);
        });

        ////////////////// refresh cards //////////////////////////
        this.game.tempPlayerInfos.players[index].cardHandlersInfos.forEach(function(cardHandler, index){
            if(cardHandler.card != null)
            {
                if(player.cardHandlers[index].card != null)
                {
                    player.cardHandlers[index].card.destroy();
                }
                if(cardHandler.card.currentCardIndex != null && player.cardHandlers[index].card != null && player.cardHandlers[index].card.currentCardIndex != null && player.cardHandlers[index].card.currentCardIndex == cardHandler.card.currentCardIndex )
                {   
                    // same card, don't update.
                }
                else
                {
                    var object = null;
                    if(cardHandler.card.type == "order")
                    {
                        object = createOrder(cardHandler.card.object);
                    }
                    else if(cardHandler.card.type == "squad")
                    {
                        object = createSquad(player.fleat,cardHandler.card.object);
                    }
                    player.cardHandlers[index].card = createCard(object, cardHandler.card.type);
                    player.cardHandlers[index].card.setHandler(player.cardHandlers[index]);
                    player.cardHandlers[index].card.currentCardIndex = cardHandler.card.currentCardIndex;
                    player.cardHandlers[index].card.drawCard();
                }
            }
            else
            {
                if(player.cardHandlers[index].card != null)
                {
                    player.cardHandlers[index].card.destroy();
                }
            }
        });
    });
}

function drawAllCards()
{
    this.game.players.forEach(function(player, index){
        player.cardHandlers.forEach(function(cardHandler){
            if(cardHandler.card != null)
            {
                cardHandler.card.drawCard();
            }
        });
    });
}

function checkEnd()
{
    if(this.game.end == 1)
    {
        if(this.game.winner != null)
        {
            finishGame();
        }
        else if(this.game.draw)
        {
            finishGame();
        }
    }
}

function finishGame()
{
    refreshInfos();
}

function refreshInfos()
{
    if(this.game.infos.tourInfos != null && this.game.infos.tourInfos.phaserObject != null)
    {
        this.game.infos.tourInfos.phaserObject.destroy();
    }
    if(this.game.end == 1)
    {
         if(this.game.winner != null)
         {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = this.game.winner.name+ " win the game !";
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
         }
         else if(this.game.draw)
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
    this.game.turn.number++;
    if(this.game.turn.player != null)
    {
        this.game.turn.player.resetEffects();
    }
    nextPlayer();
    this.game.turn.player.resetSquadsActions();
}

function loose(player)
{
    this.game.looser.push(player);
}

///////////////////////////////////////////////////////////
///////////////////// DRAG AND OVERLAP ////////////////////
///////////////////////////////////////////////////////////

function dragCard(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = true;
}

function stopDragCard(sprite, pointer)
{
    var card = sprite.ref;
    sprite.body.moves = false;
    card.isDragged = false;
    if(card.overlapedCase !== null )
    {
        if(card.type == "squad")
        {
            if(card.overlapedCase.squad == null)
            {
                this.game.server.cardPlayed(this.game.client.id, card.currentCardIndex, card.overlapedCase.number); 
            }
        }
        else if(card.type == "order")
        {
            if(card.overlapedCase.squad != null)
            {
                this.game.server.cardPlayed(this.game.client.id, card.currentCardIndex, card.overlapedCase.number); 
            }
        }
    }
    else
    {
        // set the squad to the original position.
        sprite.x = card.handler.x;
        sprite.y = card.handler.y;
    }
}

function OverLapGamingCardDraggingManagment(card)
{
    if(card.overlapedCase !== null)
    {
        if(card.type == "squad")
        {
            if(card.overlapedCase.squad == null)
            {
                card.overlapedCase.OverLaped();
            }
        }
        else if(card.type == "order")
        {
            if(card.overlapedCase.squad != null)
            {
                if(card.overlapedCase.squad.fleat.player == card.handler.player)
                {
                    card.overlapedCase.SupportOverLaped();
                }
                if(card.overlapedCase.squad.fleat.player != card.handler.player)
                {
                    card.overlapedCase.AttackOverLaped();
                }
            }

        }
    }
}

function removeBattleInfos()
{
    if(this.game.battleInfos != null)
    {
        if(this.game.battleInfos.squadTextPhaserObject != null)
        {
            this.game.battleInfos.squadTextPhaserObject.destroy();
            this.game.battleInfos.squadTextPhaserObject = null;
        }
        if(this.game.battleInfos.ennemyTextPhaserObject != null)
        {
            this.game.battleInfos.ennemyTextPhaserObject.destroy();
            this.game.battleInfos.ennemyTextPhaserObject = null;
        }
    }
    this.game.battleInfos = null;
}

function createBattleInfos(squad, target, toFriendlyFire)
{
    if(this.game.battleInfos != null && this.game.battleInfos.squad == squad && this.game.battleInfos.target == target)
    {
        return false;
    }
    var infos = {};
    infos.target = target;
    infos.squad = squad;
    infos.firePower = squad.calculFirePower();
    infos.armor = squad.lifeBar.armor;
    infos.ennemyFirePower = target.calculFirePower();
    infos.ennemyArmor = target.lifeBar.armor;
    infos.toFriendlyFire = toFriendlyFire;
    var flankBonus = squad.calcultateFlankingBonus(target);
    infos.flankBonus = [];
    if(flankBonus)
    {
        infos.flankBonus.push(flankBonus);
    }

    return infos;
}

function refreshBattleInfos()
{
    var infosBattleX = 700;
    var infosBattleY = 350;
    var textSquadName = this.game.battleInfos.squad.name;
    var textFirePower = "\nFire Power : " + this.game.battleInfos.firePower; 
    var textArmor = "\nArmor : " + this.game.battleInfos.armor;
    var textEnnemyName = this.game.battleInfos.target.name;
    var textEnnemyFirePower = "\nFire Power : " + this.game.battleInfos.ennemyFirePower; 
    var textEnnemyArmor = "\nArmor : " + this.game.battleInfos.ennemyArmor;
    var textFriendlyFire = "";
    if(this.game.battleInfos.toFriendlyFire.length > 0)
    {   
        textFriendlyFire = "\n FriendlyFire : ";
        this.game.battleInfos.toFriendlyFire.forEach(function(toFriendly){
            textFriendlyFire += "\n" + toFriendly.name;
        });
    }

    var textFlankBonus = "";
    var yPosToAdd = 0;
    this.game.battleInfos.flankBonus.forEach(function(bonus){
        yPosToAdd += 10;
        textFlankBonus += "\n flank bonus : " + bonus.damageModifier;
    });

    var style = { font: "20px Arial", fill: "#20D113"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
    var text = this.game.add.text(infosBattleX, infosBattleY, textSquadName + textFirePower + textArmor + textFlankBonus, style);
    text.anchor.set(0 , 0);
    this.game.battleInfos.squadTextPhaserObject = text;

    var infosBattleX = 700;
    var infosBattleY = 450 + yPosToAdd;

    var styleEnnemy = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
    var textEnnemy = this.game.add.text(infosBattleX, infosBattleY, textEnnemyName + textEnnemyFirePower + textEnnemyArmor + textFriendlyFire, styleEnnemy);
    textEnnemy.anchor.set(0 , 0);
    this.game.battleInfos.ennemyTextPhaserObject = textEnnemy;

}

function OverLapGamingDraggingManagment(squad)
{
    var battleInfos = false;
    if(squad.overlapedCase !== null)
    {
        if(squad.canGo(squad.overlapedCase))
        {
            if(squad.overlapedCase.squad != null)
            {
                if(squad.overlapedCase.squad.fleat.player != squad.fleat.player )
                {
                    var toFriendlyFires = squad.getFriendlyFire(squad.overlapedCase.squad);
                    toFriendlyFires.forEach(function(toFriendlyFire) {
                        toFriendlyFire.case.FirendlyFireOverlaped();
                    });
                    squad.overlapedCase.AttackOverLaped();
                    battleInfos = createBattleInfos(squad, squad.overlapedCase.squad, toFriendlyFires);
                    if(battleInfos)
                    {
                        removeBattleInfos();
                        this.game.battleInfos = battleInfos;
                        refreshBattleInfos();
                    }
                }
                else if(squad.overlapedCase.squad.fleat.player == squad.fleat.player )
                {
                    removeBattleInfos();
                    squad.overlapedCase.SupportOverLaped();
                }
            }
            else
            {
                if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.movesAllowed > 0)
                {  
                    removeBattleInfos();
                    squad.overlapedCase.OverLaped();
                }
            }
        }
        else
        {
            removeBattleInfos();
        }
    }
    else
    {
        removeBattleInfos();
    }

}

function stopDragSquadGaming(sprite, pointer)
{
    removeBattleInfos();
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    // has the squad been dragged on a case ?
    if(sprite.ref.overlapedCase !== null && sprite.ref.canGo(sprite.ref.overlapedCase))
    {
        // does the case already coutain an squad ?
        if(sprite.ref.overlapedCase.squad == null)
        {
            // if the squad is alreay on another case, remove it from the case.
            if(move(sprite))
            {
                
            }
        }
        else
        {
            if(sprite.ref.overlapedCase.squad.fleat.player == sprite.ref.fleat.player)
            {
                support(sprite.ref, sprite.ref.overlapedCase.squad);
            }
            if(sprite.ref.overlapedCase.squad.fleat.player != sprite.ref.fleat.player)
            {
                if(sprite.ref.action == null)
                {
                    attack(sprite.ref, sprite.ref.overlapedCase.squad);
                    disableDragSquad(sprite.ref);
                }
                else
                {
                    returnPreviousCase(sprite.ref);
                }
            }
        }
    }
    else
    {
        // set the squad to the original position.
        sprite.x = sprite.ref.case.phaserObject.middleX;
        sprite.y = sprite.ref.case.phaserObject.middleY;
    }
}

function returnPreviousCase(squad)
{
    // don't move the squad to the case (attack the ennemy squad instead)
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }
}

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
    
    var caseIndex = this.game.caseTable.findIndex(function(elem){
        return elem == target.case;
    });

    var attackResult = this.game.server.squadGo(this.game.client.id, squad.currentDeployedIndex, caseIndex);
    drawAttack(squad.action);
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

function findUnprocessedBattle(attackingSquad)
{
    var index = this.game.battles.findIndex(function(elem){
        return elem.isProcessed == false && elem.attackingSquad == attackingSquad;
    });
    if(typeof index == "undefined" || index == null || index == -1)
    {
        return false;
    }
    return this.game.battles[index];
}

function isDefendingAgainst(defendingSquad, attackingSquad)
{
    defendingBattle = findUnprocessedBattle(defendingSquad);
    if(defendingBattle && defendingBattle.target == attackingSquad)
    {
        return defendingBattle;
    }
    return false;
}

function drawAttack(battle)
{
    var distance = Phaser.Math.distance(battle.attackingSquad.phaserObject.x, battle.attackingSquad.phaserObject.y, battle.target.phaserObject.x, battle.target.phaserObject.y );
    var angle = game.physics.arcade.angleBetween(battle.attackingSquad.phaserObject, battle.target.phaserObject);
    //battle.attackingSquad.lifeBar.phaserObject.rotation = (-1 * angle);
    //battle.attackingSquad.phaserObject.rotation = angle;
    
    /*var arrow = this.game.add.sprite(battle.attackingSquad.phaserObject.x  , battle.attackingSquad.phaserObject.y  , 'red-arrow');
    arrow.scale.setTo(distance / arrow.width,  50 /  arrow.height);
    arrow.anchor.x = 0;
    arrow.anchor.y = 0.5;
    arrow.rotation = angle;
    arrow.alpha = 0.5;
    battle.arrowPhaserObject = arrow;*/
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
        var caseIndex = this.game.caseTable.findIndex(function(elem){
            return elem == sprite.ref.overlapedCase;
        });
        this.game.server.squadGo(this.game.client.id, sprite.ref.currentDeployedIndex, caseIndex);
        return true;
    }
    else if (sprite.ref.movesAllowed > 0)
    {
        
        sprite.ref.movesAllowed--;
        sprite.ref.movedFrom.push(sprite.ref.case);
        sprite.ref.applyMove();
        var caseIndex = this.game.caseTable.findIndex(function(elem){
            return elem == sprite.ref.overlapedCase;
        });
        this.game.server.squadGo(this.game.client.id, sprite.ref.currentDeployedIndex, caseIndex);
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

    this.game.server.squadGo(this.game.client.id, squad.currentDeployedIndex, target.case.number);
    squad.action = new action("support", target);
    return true;
}