
var gameController = function(client, server){
    this.game = null;
    this.caseTable = null;
    this.players = [];
    this.client = client;
    this.server = server;
    this.IsLoaded = false;
    this.me = null;
    this.turn = new oneTurn();
    this.infos = { tourInfos : null};
    this.battles = [];
    this.battleInfos = null;
    this.refreshing = false;
    this.end = 0;
    this.winner = null;
    this.draw = false;
    this.goGaming = false;
}

gameController.prototype = {
    launchGame : function(div)
    {
        var game = new Phaser.Game(1000, 900, Phaser.AUTO, div);
        this.game = game;

        var bootState = new boot(game);
        bootState.gameController = this;
        game.state.add("Boot",bootState);
        
        var preloadState = new preload(game);
        preloadState.gameController = this;
        game.state.add("Preload",preloadState);

        var positioningState = new positionning(game);
        positioningState.gameController = this;
        game.state.add("Positionning",positioningState);

        var theGameState = new TheGame(game);
        theGameState.gameController = this;
        game.state.add("TheGame",theGameState);
        this.server.wantToGame(this.client.id);
        this.game.state.start("Boot");
        return game;
    },
    cleanPhaserObjectReferences : function()
    {
        this.players.forEach(function(player){
            player.cards.forEach(function(card){
                card.phaserObject = null;
            });
        });
    },
    initTurns : function()
    {
        this.turn.number = 0;
    },
    drawAllCards : function()
    {
        var ref = this;
        this.players.forEach(function(player, index){
            player.cards.forEach(function(card, cardIndex){
                if(card != null)
                {
                    ref.setCardPosition(player, card, cardIndex);
                    card.drawCard();
                }
            });
        });
    },
    refreshPlayers : function(playerInfos)
    {
        var ref = this;
        this.players.forEach(function(player, index){
            ////////////// refresh squads /////////////////////////
            player.fleat.deployedSquad.forEach(function(squad){
                squad.toClean = true;
            });
            playerInfos.players[index].fleat.deployedSquad.forEach(function(squadJson, indexTemp){
                let squadIndex = player.fleat.deployedSquad.findIndex(function(elem){
                    return elem.currentDeployedIndex == squadJson.currentDeployedIndex;
                });
                if(squadIndex != -1 )
                {
                    player.fleat.deployedSquad[squadIndex].toClean = false;
                    player.fleat.deployedSquad[squadIndex].refreshDatas(squadJson, ref.caseTable);
                    player.fleat.deployedSquad[squadIndex].toPosition();
                    player.fleat.deployedSquad[squadIndex].drawLifeBar();
                }
                else
                {
                    var newSquad = createSquad(ref.game, player.fleat, squadJson);
                    newSquad.toClean = false;
                    newSquad.case = ref.caseTable[squadJson.case.number];
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

            player.cards.forEach(function(c){
                c.toDestroy = true;
            });
            ////////////////// refresh cards //////////////////////////
            playerInfos.players[index].cardsInfos.forEach(function(card, index){
                if(card != null)
                {
                    let cardIndex = player.cards.findIndex(function(elem){
                        return elem.currentCardIndex == card.currentCardIndex;
                    });
                    if(cardIndex != -1)
                    {
                        player.cards[cardIndex].toDestroy = false;
                    }
                    else
                    {
                        var object = null;
                        if(card.type == "order")
                        {
                            object = createOrder(ref.game, card.object);
                        }
                        else if(card.type == "squad")
                        {
                            object = createSquad(ref.game, player.fleat,card.object);
                        }
                        else if(card.type == "captain")
                        {
                            object = createCaptain(ref.game, player, card.object);
                        }
                        let newCard = createCard(ref.game, player, object, card.type);
                        newCard.toDestroy = false;
                        player.cards.push(newCard);
                        newCard.currentCardIndex = card.currentCardIndex;
                       
                    }
                }
            });
            var toCleanArray = [];
            player.cards.forEach(function(c, index){
                if(c.toDestroy)
                {
                    toCleanArray.push(index);
                }
            });

            toCleanArray.forEach(function(indexToRemove){
                player.cards[indexToRemove].destroy();
                player.cards.splice(indexToRemove, 1);
            });

            player.cards.forEach(function(card, index){
                ref.setCardPosition(player, card, index);
                card.drawCard();
            });
        });
    },   
    setCardPosition : function(player, card, /* optional */ index)
    {
        if(typeof index == "undefined")
        {
            var index = player.cards.findIndex(function(elem){
                return elem.currentCardIndex == card.currentCardIndex;
            });
        }
        if(card.isNeutral())
        {
            var x = 500;
            var y = 50;
            var angle = 1.6;
            if(index != 0)
            {
                x = player.cards[index - 1].x + 50;
                y = player.cards[index - 1].y;
                angle = player.cards[index - 1].angle + 0.2;
            }
            card.x = x;
            card.y = y;
            card.angle = angle;
        }
        else
        {
            var x = 400;
            var y = 700;
            var angle = - 1.6;
            if(index != 0)
            {
                x = player.cards[index - 1].x + 50;
                y = player.cards[index - 1].y;
                angle = player.cards[index - 1].angle + 0.2;
            }
            card.x = x;
            card.y = y;
            card.angle = angle;
        }
    },
    refreshInfos : function()
    {
        if(this.infos.tourInfos != null && this.infos.tourInfos.phaserObject != null)
        {
            this.infos.tourInfos.phaserObject.destroy();
        }
        if(this.end == 1)
        {
            if(this.winner != null)
            {
                var infosTourX = 700;
                var infosTourY = 100;
                var textTour = this.winner.name+ " win the game !";
                var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
                var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
                text.anchor.set(0 , 0);
                this.infos.tourInfos = {};
                this.infos.tourInfos.phaserObject = text;
            }
            else if(this.draw)
            {
                var infosTourX = 700;
                var infosTourY = 100;
                var textTour = "DRAW !";
                var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
                var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
                text.anchor.set(0 , 0);
                this.infos.tourInfos = {};
                this.infos.tourInfos.phaserObject = text;
            }
        }
        else
        {
            if(this.turn.player != null)
            {
                var infosTourX = 700;
                var infosTourY = 100;
                var textTour = " Turn : " + this.turn.player.name;
                var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
                var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
                text.anchor.set(0 , 0);
                this.infos.tourInfos = {};
                this.infos.tourInfos.phaserObject = text;
            }
        }
    },
    getOverlapedCase : function (caseTable)
    {
        let overLapCase = null;
        var ref = this;
        caseTable.forEach(function(oneCase){
            if (oneCase.phaserObject.points.contains(ref.game.input.x, ref.game.input.y))
            {
                overLapCase = oneCase;
            }
        });
        return overLapCase;
    },
    finishPositioning : function()
    {
        this.game.state.start("TheGame");
    },
    addPlayer : function(playerInfos, isMe)
    {
        this.players.push(createPlayer(this.game, playerInfos, this.players.length, isMe));
    },
    setCaseTable : function(caseTable)
    {
        this.caseTable = caseTable;
    },
    startPositioning : function()
    {
        this.game.state.start("Positionning");
    },
    setMe : function(index)
    {
        this.me = this.players[index];
    },
    removeBattleInfos : function()
    {
        if(this.battleInfos != null)
        {
            if(this.battleInfos.squadTextPhaserObject != null)
            {
                this.battleInfos.squadTextPhaserObject.destroy();
                this.battleInfos.squadTextPhaserObject = null;
            }
            if(this.battleInfos.ennemyTextPhaserObject != null)
            {
                this.battleInfos.ennemyTextPhaserObject.destroy();
                this.battleInfos.ennemyTextPhaserObject = null;
            }
        }
        this.battleInfos = null;
    },
    checkEnd : function()
    {
        if(this.end == 1)
        {
            if(this.winner != null)
            {
                this.finishGame();
            }
            else if(this.draw)
            {
                this.finishGame();
            }
        }
    },
    finishGame : function()
    {
        this.refreshInfos();
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
    createBattleInfos : function(squad, target, toFriendlyFire)
    {
        if(this.battleInfos != null && this.battleInfos.squad == squad && this.battleInfos.target == target)
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
        var flankBonus = squad.calcultateFlankingBonus(target, this.getDefendingAgainst(target));
        infos.flankBonus = [];
        if(flankBonus)
        {
            infos.flankBonus.push(flankBonus);
        }
        return infos;
    },
    attack : function(squad, target)
    {
        // don't move the squad to the case (attack the ennemy squad instead)
        if(squad.case !== null)
        {
            squad.phaserObject.x = squad.case.phaserObject.middleX;
            squad.phaserObject.y = squad.case.phaserObject.middleY;
        }
        squad.action = this.addBattle(squad, target);
        //target.action = this.addBattle(target, squad);
        
        var caseIndex = this.caseTable.findIndex(function(elem){
            return elem == target.case;
        });

        var attackResult = this.server.squadGo(this.client.id, squad.currentDeployedIndex, caseIndex);
        this.drawAttack(squad.action);
    },
    addBattle : function(attackingSquad, target)
    {
        var theBattle = createBattle(attackingSquad, target);
        this.battles.push(theBattle);
        return theBattle;
    },
    drawAttack : function(battle)
    {

    },
    support : function(squad, target)
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

        this.server.squadGo(this.client.id, squad.currentDeployedIndex, target.case.number);
        squad.action = new action("support", target);
        return true;
    },
    nextTurn : function()
    {
        this.battles = [];
        this.turn.number++;
        if(this.turn.player != null)
        {
            this.turn.player.resetEffects();
        }
        this.nextPlayer();
        this.turn.player.resetSquadsActions();
    },
    nextPlayer : function()
    {
        if(this.me == this.turn.player)
        {
            this.server.nextTurn(this.client.id);
        }
    },
    move : function(squad)
    {
        if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase)
        {
            if(squad.case !== null)
            {
                squad.case.squad = null;
            }
            squad.movesAllowed = squad.movesAllowed + 1;
            squad.movedFrom.pop();
            squad.applyMove();
            var caseIndex = this.caseTable.findIndex(function(elem){
                return elem == squad.overlapedCase;
            });
            this.server.squadGo(this.client.id, squad.currentDeployedIndex, caseIndex);
            return true;
        }
        else if (squad.movesAllowed > 0)
        {
            
            squad.movesAllowed--;
            squad.movedFrom.push(squad.case);
            squad.applyMove();
            var caseIndex = this.caseTable.findIndex(function(elem){
                return elem == squad.overlapedCase;
            });
            this.server.squadGo(this.client.id, squad.currentDeployedIndex, caseIndex);
            return true;
        }
        else
        {
            if(squad.case !== null)
            {
                squad.phaserObject.x = squad.case.phaserObject.middleX;
                squad.phaserObject.y = squad.case.phaserObject.middleY;
            }
        }
        return false;
    },
    checkRefreshInfos : function()
    {
        if(this.tempPlayersInfos != null)
        {
            this.refreshPlayers(this.tempPlayersInfos);
            this.tempPlayersInfos = null;
        }
        if(this.tempPlayerIndex != null)
        {
            if(this.tempPlayerIndex != -1)
            {
                this.turn.player = this.players[this.tempPlayerIndex];
                if(this.turn.player == this.me)
                {
                    this.refreshInfos();
                    this.game.state.getCurrentState().unlockMe();
                }
                else
                {
                    this.refreshInfos();
                    this.game.state.getCurrentState().lockMe();
                }
            }
            this.tempPlayerIndex = null;
        }
    },
    drawAllSquads : function()
    {
        this.players.forEach(function(player){
            player.drawAllSquads();
        });
    },
    drawCases : function()
    {
        var startx = 200;
        var starty = 100;
        var i;
        for(i = 0; i < 3; i++)
        {
            var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
            var c = this.caseTable[i];
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.alpha= 0;
            graphics.endFill();
            graphics.points = poly;
            c.phaserObject = graphics;

            var graphicsBorder = this.game.add.graphics(0, 0);
            graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
            graphicsBorder.moveTo(startx,starty);
            graphicsBorder.lineTo(startx+61,starty-35);
            graphicsBorder.lineTo(startx+122,starty);
            graphicsBorder.lineTo(startx + 122,starty+70);
            graphicsBorder.lineTo(startx + 61,starty+105);
            graphicsBorder.lineTo(startx,starty+70);
            graphicsBorder.lineTo(startx,starty);

            graphicsBorder.alpha= 1;

            startx = startx+122;
        }    

        var startx = 200 - 61;
        var starty = 100 + 35 + 70;
        for(i = 3; i < 7; i++)
        {
            var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
            var c = this.caseTable[i];
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.alpha= 0;
            graphics.endFill();
            graphics.points = poly;
            c.phaserObject = graphics;

            var graphicsBorder = this.game.add.graphics(0, 0);
            graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
            graphicsBorder.moveTo(startx,starty);
            graphicsBorder.lineTo(startx+61,starty-35);
            graphicsBorder.lineTo(startx+122,starty);
            graphicsBorder.lineTo(startx + 122,starty+70);
            graphicsBorder.lineTo(startx + 61,starty+105);
            graphicsBorder.lineTo(startx,starty+70);
            graphicsBorder.lineTo(startx,starty);

            startx = startx+122;
        }  

        var startx = 200 - 61 - 61;
        var starty = 100 + 35 + 70 + 35 + 70;
        for(i = 7; i < 12; i++)
        {
            var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
            var c = this.caseTable[i];
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.points = poly;
            graphics.alpha= 0;
            graphics.endFill();
            c.phaserObject = graphics;
            
            var graphicsBorder = this.game.add.graphics(0, 0);
            graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
            graphicsBorder.moveTo(startx,starty);
            graphicsBorder.lineTo(startx+61,starty-35);
            graphicsBorder.lineTo(startx+122,starty);
            graphicsBorder.lineTo(startx + 122,starty+70);
            graphicsBorder.lineTo(startx + 61,starty+105);
            graphicsBorder.lineTo(startx,starty+70);
            graphicsBorder.lineTo(startx,starty);

            startx = startx+122;
        }  

        var startx = 200 - 61 - 61 + 61;
        var starty = 100 + 35 + 70 + 35 + 70 + 35 + 70;
        for(i = 12; i < 16; i++)
        {
            var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
            var c = this.caseTable[i];
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.points = poly;
            graphics.alpha= 0;
            graphics.endFill();
            c.phaserObject = graphics;

            var graphicsBorder = this.game.add.graphics(0, 0);
            graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
            graphicsBorder.moveTo(startx,starty);
            graphicsBorder.lineTo(startx+61,starty-35);
            graphicsBorder.lineTo(startx+122,starty);
            graphicsBorder.lineTo(startx + 122,starty+70);
            graphicsBorder.lineTo(startx + 61,starty+105);
            graphicsBorder.lineTo(startx,starty+70);
            graphicsBorder.lineTo(startx,starty);

            startx = startx+122;
        }  

        var startx = 200 - 61 - 61 + 61 + 61;
        var starty = 100 + 35 + 70 + 35 + 70 + 35 + 70 + 35 + 70;
        for(i = 16; i < 19; i++)
        {
            var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
            var c = this.caseTable[i];
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.points = poly;
            graphics.alpha= 0;
            graphics.endFill();
            c.phaserObject = graphics;

            var graphicsBorder = this.game.add.graphics(0, 0);
            graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
            graphicsBorder.moveTo(startx,starty);
            graphicsBorder.lineTo(startx+61,starty-35);
            graphicsBorder.lineTo(startx+122,starty);
            graphicsBorder.lineTo(startx + 122,starty+70);
            graphicsBorder.lineTo(startx + 61,starty+105);
            graphicsBorder.lineTo(startx,starty+70);
            graphicsBorder.lineTo(startx,starty);

            startx = startx+122;
        }  
    }
}