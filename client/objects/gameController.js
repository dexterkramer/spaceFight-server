
var gameController = function(phaserObject){
    this.phaserObject = phaserObject;
    this.caseTable = null;
    this.players = [];
    this.client = null;
    this.server = null;
    this.me = null;
    this.turn = null;
}

gameController.prototype = {
    setCaseTable : function(caseTable)
    {
        this.caseTable = caseTable;
    },
    nextPlayer : function(rewind)
    {
        if(this.me == this.turn.player)
        {
            this.server.nextTurn(this.client.id);
        }
    },
    createFleat : function(player, fleatJson)
    {
        var fleat = new oneFleat(this, fleatJson.name, player);
        fleatJson.deployedSquad.forEach(function(squadJson){
            fleat.deploySquad(this.createSquad(fleat, squadJson));
        });
        return fleat;
    },
    createSquad : function(fleat, squadJson)
    {
        var squad = new oneSquad(this, squadJson.name, fleat);
        squad.currentDeployedIndex = squadJson.currentDeployedIndex;
        squadJson.ships.forEach(function(shipJson){
            if(shipJson != null)
            {
                squad.addShip(new ship(shipJson));
            }
        });
        squad.createLifeBar();
        return squad;
    },
    createPlayer : function(playerJson, number, availableCasePositioning, availableCaseDeploying, isMe)
    {
        var player = new onePlayer(playerJson.name, number, availableCasePositioning, availableCaseDeploying, isMe);
        player.fleat = this.createFleat(player, playerJson.fleat );
        if(playerJson.fleat.capitalShip != null && playerJson.fleat.capitalShip != false)
        {
            player.fleat.addCapitalShip(playerJson.fleat.capitalShip);
        }

        player.createPick();
        return player;
    },
    createCases : function(casemap)
    {
        var caseByLine = 4;
        var lines = 4;
        this.caseTable = [];
        casemap.forEach(function(elem){
            let newCase = new oneCase(elem.name, elem.number, elem.height, elem.width);
            this.caseTable[elem.number] = newCase;
        });

        casemap.forEach(function(elem){
            this.caseTable[elem.number].left = (elem.links.left !== null) ? this.caseTable[elem.links.left] : null;
            this.caseTable[elem.number].right = (elem.links.right !== null) ? this.caseTable[elem.links.right] : null;
            this.caseTable[elem.number].topLeft = (elem.links.topLeft !== null) ? this.caseTable[elem.links.topLeft] : null;
            this.caseTable[elem.number].topRight = (elem.links.topRight !== null) ? this.caseTable[elem.links.topRight] : null;
            this.caseTable[elem.number].bottomLeft = (elem.links.bottomLeft !== null) ? this.caseTable[elem.links.bottomLeft] : null;
            this.caseTable[elem.number].bottomRight = (elem.links.bottomRight !== null) ? this.caseTable[elem.links.bottomRight] : null;
        });
    },
    createOrders : function(player, ordersJson)
    {
        var orderArray = [];
        var ref = this;
        ordersJson.forEach(function(order){
            orderArray.push(ref.createOrder(order));
        });
        return orderArray;
    },
    createOrder : function(orderJson)
    {
        var orderObject = new oneOrder(orderJson.name, orderJson.effects);
        return orderObject;
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
                ref.enableDragCard(cardHandler.card, dragCard, stopDragCard);
            }
        });
    },
    lockMe : function()
    {
        var ref = this;
        this.me.fleat.deployedSquad.forEach(function(squad){
            ref.disableDragSquad(squad);
        });
        this.me.cardHandlers.forEach(function(cardHandler){
            if(cardHandler.card != null)
            {
                ref.disableDragCard(cardHandler.card);
            }
        });
    },
    disableDragSquad : function(squad)
    {
        if(squad.phaserObject != null && squad.phaserObject.input != null)
        {
            squad.phaserObject.input.disableDrag();
        }
    },
    disableDragCard : function(card)
    {
        if(card.phaserObject.input != null)
        {
            card.phaserObject.input.disableDrag();
        }
    },
    drawSquad : function(squad, x, y)
    {
        var squadWidth = 100;
        var squadHeight = 100;
        let oneSquad = this.phaserObject.add.sprite(x, y, 'squad');
        oneSquad.anchor.x = 0.5;
        oneSquad.anchor.y = 0.5;
        oneSquad.scale.setTo(squadWidth / oneSquad.width, squadHeight / oneSquad.height);
        oneSquad.ref = squad;
        squad.phaserObject = oneSquad;
        squad.drawLifeBar();
    },
    drawCardSquad : function(card, x, y)
    {
        let oneCard = this.phaserObject.add.sprite(x, y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(card.handler.width / oneCard.width, card.handler.height / oneCard.height);
        oneCard.ref = card;
        card.phaserObject = oneCard;
        let oneSquad = this.phaserObject.add.sprite(0, 0, 'squad');
        oneSquad.anchor.x = 0.5;
        oneSquad.anchor.y = 0.5;
        oneCard.addChild(oneSquad);
    },
    drawCardNeutral : function(card, x, y)
    {
        let oneCard = this.phaserObject.add.sprite(x, y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(card.handler.width / oneCard.width, card.handler.height / oneCard.height);
        oneCard.ref = card;
        card.phaserObject = oneCard;
    },
    enableDragCard : function(card, dragSquadFunc, stopDragSquadFunc)
    {
        card.phaserObject.inputEnabled = true;
        this.phaserObject.physics.arcade.enable(card.phaserObject);
        card.phaserObject.input.enableDrag();
        card.phaserObject.events.onDragStart.add(dragSquadFunc, this);
        card.phaserObject.events.onDragStop.add(stopDragSquadFunc, this);
    },
    enableDragSquad : function(squad, dragSquadFunc, stopDragSquadFunc)
    {
        squad.phaserObject.inputEnabled = true;
        this.phaserObject.physics.arcade.enable(squad.phaserObject);
        squad.phaserObject.input.enableDrag();
        squad.phaserObject.events.onDragStart.add(dragSquadFunc, this);
        squad.phaserObject.events.onDragStop.add(stopDragSquadFunc, this);
    },
    drawLifeBar : function(lifebarObject)
    {
        var lifeBarX = -50;
        var lifeBarY = 35;
        var lifeBarHeight = 8;
        var lifebarWidth = 100;

        var lifeBar = this.phaserObject.add.graphics(lifeBarX, lifeBarY);
        lifeBar.lineStyle(lifeBarHeight, lifebarObject.getLifeBarColor());
        lifeBar.lineTo(lifebarWidth * percent, 0);
        //this.phaserObject.addChild(lifeBar);
        lifeBar.anchor.set(0, 0);
        var style = { font: "9px Arial",/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.phaserObject.add.text(lifeBarX, lifeBar.y - (lifeBarHeight / 2) - 3, lifebarObject.armor + "/" + lifebarObject.maxArmor , style);
        text.anchor.set(0 , 0);
        text.x = lifeBarX + ((lifebarWidth * percent) / 2) - (text.width / 2);
        lifeBar.textObject = text;
        return lifeBar;
    },
    drawCardOrder : function(card, x, y)
    {
        let oneCard = this.phaserObject.add.sprite(x, y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(card.handler.width / oneCard.width, card.handler.height / oneCard.height);
        oneCard.ref = card;
        card.phaserObject = oneCard;
        var style = { font: "35px Arial",fill: "#ff0044"/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.phaserObject.add.text(0, 0, card.object.name , style);
        text.anchor.set(0 , 0);
        oneCard.addChild(text);
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