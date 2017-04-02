
var gameController = function(client, server){
    this.game = null;
    this.caseTable = null;
    this.players = [];
    this.client = client;
    this.server = server;
    this.IsLoaded = false;
    this.me = null;
    this.turn = new oneTurn();;
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
    addPlayer : function(playerInfos, isMe)
    {
        if(this.players.length == 0)
        {
            this.players.push(createPlayer(this.game, playerInfos, 0, this.caseTable.slice( 12 , 19), this.caseTable.slice( 16 , 19), isMe));
        }
        else if(this.players.length == 1)
        {
            this.players.push(createPlayer(this.game, playerInfos, 1, this.game.caseTable.slice( 0 , 7 ), this.game.caseTable.slice( 0 , 3 ), isMe));
        }
        
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
    nextPlayer : function(rewind)
    {
        if(this.me == this.turn.player)
        {
            this.server.nextTurn(this.client.id);
        }
    },
    checkOverLapSquad : function(player, caseTable, OverLapDraggingManagmentFunc)
    {
        player.fleat.deployedSquad.forEach(function(squad){
            if(squad.isDragged)
            {
                squad.overlapedCase = getOverlapedCase(caseTable);
                OverLapDraggingManagmentFunc(squad);
            }
        });
    },
    checkOverLapCard : function(player, caseTable, deployAvailableCase, OverLapDraggingManagmentFunc)
    {
        var ref = this;
        player.cardHandlers.forEach(function(cardHandler){
            if(cardHandler.card != null && cardHandler.card.isDragged)
            {
                if(cardHandler.card.type == "order")
                {
                    cardHandler.card.overlapedCase = ref.getOverlapedCase(caseTable);
                }
                else if(cardHandler.card.type == "squad")
                {
                    cardHandler.card.overlapedCase = ref.getOverlapedCase(deployAvailableCase);
                }
                OverLapDraggingManagmentFunc(cardHandler.card);
            }
        });
    },
    getOverlapedCase : function(caseTable)
    {
        let overLapCase = null;
        caseTable.forEach(function(oneCase){
            if (oneCase.phaserObject.points.contains(this.phaserObject.input.x, this.phaserObject.input.y))
            {
                overLapCase = oneCase;
            }
        });
        return overLapCase;
    },
    unlockMe : function()
    {
        var ref = this;
        this.me.fleat.deployedSquad.forEach(function(squad){
            ref.enableDragSquad(squad, dragSquad, stopDragSquadGaming);
        });
        this.me.cardHandlers.forEach(function(cardHandler){
            if(cardHandler.card != null)
            {
                cardHandler.card.enableDrag(dragCard, stopDragCard);
            }
        });
    },
    lockMe : function()
    {
        var ref = this;
        this.me.fleat.deployedSquad.forEach(function(squad){
            squad.disableDrag();
        });
        this.me.cardHandlers.forEach(function(cardHandler){
            if(cardHandler.card != null)
            {
                cardHandler.card.disableDrag();
            }
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
            var graphics = this.phaserObject.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.alpha= 0;
            graphics.endFill();
            graphics.points = poly;
            c.phaserObject = graphics;

            var graphicsBorder = this.phaserObject.add.graphics(0, 0);
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
            var graphics = this.phaserObject.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.alpha= 0;
            graphics.endFill();
            graphics.points = poly;
            c.phaserObject = graphics;

            var graphicsBorder = this.phaserObject.add.graphics(0, 0);
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
            var graphics = this.phaserObject.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.points = poly;
            graphics.alpha= 0;
            graphics.endFill();
            c.phaserObject = graphics;
            
            var graphicsBorder = this.phaserObject.add.graphics(0, 0);
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
            var graphics = this.phaserObject.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.points = poly;
            graphics.alpha= 0;
            graphics.endFill();
            c.phaserObject = graphics;

            var graphicsBorder = this.phaserObject.add.graphics(0, 0);
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
            var graphics = this.phaserObject.add.graphics(0, 0);
            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(poly.points);
            graphics.middleX = startx + 61;
            graphics.middleY = starty + 35;
            graphics.points = poly;
            graphics.alpha= 0;
            graphics.endFill();
            c.phaserObject = graphics;

            var graphicsBorder = this.add.graphics(0, 0);
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