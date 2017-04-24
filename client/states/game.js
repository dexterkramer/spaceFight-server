var TheGame = function(game){
};
  
TheGame.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        this.gameController.initTurns();
        this.gameController.drawCases();
        this.gameController.drawAllCards();
        this.gameController.drawAllSquads();
        this.gameController.server.okToGame(this.gameController.client.id);
        this.game.add.button(600, 600, 'button', this.gameController.nextTurn.bind(this.gameController), this, 1, 0, 1);
      },
    update : function(){
        this.gameController.checkEnd();
        this.gameController.checkRefreshInfos();
        if(this.gameController.turn.player == this.gameController.me)
        {
            this.gameController.caseTable.forEach(function(oneCase){
                oneCase.NotOverLaped();
            });
            this.checkOverLapSquad(this.gameController.me,this.gameController.caseTable);
            this.checkOverLapCard(this.gameController.me,this.gameController.caseTable, this.gameController.me.availableCaseDeploying);
        }
    },
    dragCard : function(sprite, pointer)
    {
        sprite.body.moves = false;
        sprite.ref.isDragged = true;
    },
    stopDragCard : function(sprite, pointer)
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
                    this.gameController.server.cardPlayed(this.gameController.client.id, card.currentCardIndex, card.overlapedCase.number); 
                }
            }
            else if(card.type == "order")
            {
                if(card.overlapedCase.squad != null)
                {
                    this.gameController.server.cardPlayed(this.gameController.client.id, card.currentCardIndex, card.overlapedCase.number); 
                }
            }
            else if(card.type == "captain")
            {
                if(card.overlapedCase.squad != null)
                {
                    this.gameController.server.cardPlayed(this.gameController.client.id, card.currentCardIndex, card.overlapedCase.number);
                }
            }
        }
        else
        {
            // set the squad to the original position.
            sprite.x = card.x;
            sprite.y = card.y;
        }
    },
    dragSquad : function(sprite, pointer)
    {
        sprite.body.moves = false;
        sprite.ref.isDragged = true;
    },
    stopDragSquad : function(sprite, pointer)
    {
        this.gameController.removeBattleInfos();
        sprite.body.moves = false;
        var squad = sprite.ref;
        squad.isDragged = false;
        // has the squad been dragged on a case ?
        if(squad.overlapedCase !== null && squad.canGo(squad.overlapedCase))
        {
            // does the case already coutain an squad ?
            if(squad.overlapedCase.squad == null)
            {
                // if the squad is alreay on another case, remove it from the case.
                this.gameController.move(squad);
            }
            else
            {
                if(squad.overlapedCase.squad.fleat.player == squad.fleat.player)
                {
                    this.gameController.support(squad, squad.overlapedCase.squad);
                }
                if(squad.overlapedCase.squad.fleat.player != squad.fleat.player)
                {
                    if(squad.action == null)
                    {
                        this.gameController.attack(squad, squad.overlapedCase.squad);
                        squad.disableDrag();
                    }
                    else
                    {
                        squad.returnPreviousCase();
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
    },  
    checkOverLapSquad : function(player, caseTable)
    {
        var ref = this;
        player.fleat.deployedSquad.forEach(function(squad){
            if(squad.isDragged)
            {
                squad.overlapedCase = ref.gameController.getOverlapedCase(caseTable);
                ref.OverLapgDraggingManagment(squad);
            }
        });
    },
    OverLapgDraggingManagment : function(squad)
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
                        var toFriendlyFires = squad.getFriendlyFire(squad.overlapedCase.squad, this.gameController.getDefendingAgainst(squad.overlapedCase.squad));
                        toFriendlyFires.forEach(function(toFriendlyFire) {
                            toFriendlyFire.case.FirendlyFireOverlaped();
                        });
                        squad.overlapedCase.AttackOverLaped();
                        battleInfos = this.gameController.createBattleInfos(squad, squad.overlapedCase.squad, toFriendlyFires);
                        if(battleInfos)
                        {
                            this.gameController.removeBattleInfos();
                            this.gameController.battleInfos = battleInfos;
                            this.refreshBattleInfos();
                        }
                    }
                    else if(squad.overlapedCase.squad.fleat.player == squad.fleat.player )
                    {
                        this.gameController.removeBattleInfos();
                        squad.overlapedCase.SupportOverLaped();
                    }
                }
                else
                {
                    if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.movesAllowed > 0)
                    {  
                        this.gameController.removeBattleInfos();
                        squad.overlapedCase.OverLaped();
                    }
                }
            }
            else
            {
                this.gameController.removeBattleInfos();
            }
        }
        else
        {
            this.gameController.removeBattleInfos();
        }
    },
    refreshBattleInfos : function()
    {
        var infosBattleX = 700;
        var infosBattleY = 350;
        var textSquadName = this.gameController.battleInfos.squad.name;
        var textFirePower = "\nFire Power : " + this.gameController.battleInfos.firePower; 
        var textArmor = "\nArmor : " + this.gameController.battleInfos.armor;
        var textEnnemyName = this.gameController.battleInfos.target.name;
        var textEnnemyFirePower = "\nFire Power : " + this.gameController.battleInfos.ennemyFirePower; 
        var textEnnemyArmor = "\nArmor : " + this.gameController.battleInfos.ennemyArmor;
        var textFriendlyFire = "";
        if(this.gameController.battleInfos.toFriendlyFire.length > 0)
        {   
            textFriendlyFire = "\n FriendlyFire : ";
            this.gameController.battleInfos.toFriendlyFire.forEach(function(toFriendly){
                textFriendlyFire += "\n" + toFriendly.name;
            });
        }

        var textFlankBonus = "";
        var yPosToAdd = 0;
        this.gameController.battleInfos.flankBonus.forEach(function(bonus){
            yPosToAdd += 10;
            textFlankBonus += "\n flank bonus : " + bonus.damageModifier;
        });

        var style = { font: "20px Arial", fill: "#20D113"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.gameController.game.add.text(infosBattleX, infosBattleY, textSquadName + textFirePower + textArmor + textFlankBonus, style);
        text.anchor.set(0 , 0);
        this.gameController.battleInfos.squadTextPhaserObject = text;

        var infosBattleX = 700;
        var infosBattleY = 450 + yPosToAdd;

        var styleEnnemy = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var textEnnemy = this.gameController.game.add.text(infosBattleX, infosBattleY, textEnnemyName + textEnnemyFirePower + textEnnemyArmor + textFriendlyFire, styleEnnemy);
        textEnnemy.anchor.set(0 , 0);
        this.gameController.battleInfos.ennemyTextPhaserObject = textEnnemy;
    },
    checkOverLapCard : function(player, caseTable, deployAvailableCase)
    {
        var ref = this;
        player.cards.forEach(function(card){
            if(card != null && card.isDragged)
            {
                if(card.type == "order")
                {
                    card.overlapedCase = ref.gameController.getOverlapedCase(caseTable);
                }
                else if(card.type == "squad")
                {
                    card.overlapedCase = ref.gameController.getOverlapedCase(deployAvailableCase);
                }
                ref.OverLapCardDraggingManagment(card);
            }
        });
    },
    OverLapCardDraggingManagment : function(card)
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
                    if(card.overlapedCase.squad.fleat.player == card.player)
                    {
                        card.overlapedCase.SupportOverLaped();
                    }
                    if(card.overlapedCase.squad.fleat.player != card.player)
                    {
                        card.overlapedCase.AttackOverLaped();
                    }
                }
            }
            else if(card.type == "captain")
            {
                if(card.overlapedCase.squad == null && card.overlapedCase.squad.fleat.player == card.player)
                {
                    card.overlapedCase.OverLaped();
                }
            }
        }
    },
    unlockMe : function()
    {
        var ref = this;
        this.gameController.me.fleat.deployedSquad.forEach(function(squad){
            squad.enableDrag(ref.dragSquad, ref.stopDragSquad, ref);
        });
        this.gameController.me.cards.forEach(function(card){
            if(card != null)
            {
                card.enableDrag(ref.dragCard, ref.stopDragCard, ref);
            }
        });
    },
    lockMe : function()
    {
        var ref = this;
        this.gameController.me.fleat.deployedSquad.forEach(function(squad){
            squad.disableDrag();
        });
        this.gameController.me.cards.forEach(function(card){
            if(card != null)
            {
                card.disableDrag();
            }
        });
    }
}