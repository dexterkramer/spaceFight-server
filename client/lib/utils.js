function checkOverLapSquad(player, caseTable, OverLapDraggingManagmentFunc)
{
    player.fleat.deployedSquad.forEach(function(squad){
        if(squad.isDragged)
        {
            squad.overlapedCase = getOverlapedCase(caseTable);
            OverLapDraggingManagmentFunc(squad);
        }
    });
}

function checkOverLapCard(player, caseTable, deployAvailableCase, OverLapDraggingManagmentFunc)
{
    player.cardHandlers.forEach(function(cardHandler){
        if(cardHandler.card != null && cardHandler.card.isDragged)
        {
            if(cardHandler.card.type == "order")
            {
                cardHandler.card.overlapedCase = getOverlapedCase(caseTable);
            }
            else if(cardHandler.card.type == "squad")
            {
                cardHandler.card.overlapedCase = getOverlapedCase(deployAvailableCase);
            }
            OverLapDraggingManagmentFunc(cardHandler.card);
        }
    });
}

function getOverlapedCase (caseTable)
{
    let overLapCase = null;
    caseTable.forEach(function(oneCase){
        if (oneCase.phaserObject.points.contains(this.game.input.x, this.game.input.y))
        {
            overLapCase = oneCase;
        }
    });
    return overLapCase;
}

function dragSquad(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = true;
}

function stopDragPlayer(sprite)
{
    // has the squad been dragged on a case ?
    if(sprite.ref.overlapedCase !== null)
    {
        // does the case already coutain an squad ?
        if(sprite.ref.overlapedCase.squad == null)
        {
            // if the squad is alreay on another case, remove it from the case.
            if(sprite.ref.case !== null)
            {
                sprite.ref.case.squad = null;
            }

            //linking the squad to the new case.
            sprite.ref.case = sprite.ref.overlapedCase;
            sprite.ref.overlapedCase.squad = sprite.ref;

            // move the sprite of the esouade to his new position 
            sprite.x = sprite.ref.overlapedCase.phaserObject.middleX;
            sprite.y = sprite.ref.overlapedCase.phaserObject.middleY;
        }
        else
        {
            // go here if the squad is moved to a case already countaining a fleet.
            // if the esouade had already a case : get back to the previous case.
            if(sprite.ref.case !== null)
            {
                sprite.x = sprite.ref.case.phaserObject.middleX;
                sprite.y = sprite.ref.case.phaserObject.middleY;
            }
            else
            {
                // else if the squad is not linked to a case : return to the original position.
                sprite.x = sprite.ref.originalX;
                sprite.y = sprite.ref.originalY;
            }
        }
    }
    else
    {
        // go here if the squad is not dragged on a case.
        // if the squad add a case previously : remove it.
        if(sprite.ref.case !== null)
        {
            sprite.ref.case.squad = null;
            sprite.ref.case = null;
        }

        // set the squad to the original position.
        sprite.x = sprite.ref.originalX;
        sprite.y = sprite.ref.originalY;
    }
}

function stopDragSquad(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    stopDragPlayer(sprite);
}

function drawCases(game)
{
    var startx = 200;
    var starty = 100;
    var i;
    for(i = 0; i < 3; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = this.game.caseTable[i];
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
        var c = this.game.caseTable[i];
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
        var c = this.game.caseTable[i];
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
        var c = this.game.caseTable[i];
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
        var c = this.game.caseTable[i];
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

function unlockMe()
{
    this.game.me.fleat.deployedSquad.forEach(function(squad){
        squad.enableDrag(dragSquad, stopDragSquadGaming);
    });
    this.game.me.cardHandlers.forEach(function(cardHandler){
        if(cardHandler.card != null)
        {
            cardHandler.card.enableDrag(dragCard, stopDragCard);
        }
    });
}

function lockMe()
{
    this.game.me.fleat.deployedSquad.forEach(function(squad){
        squad.disableDrag();
    });
    this.game.me.cardHandlers.forEach(function(cardHandler){
        if(cardHandler.card != null)
        {
            cardHandler.card.disableDrag();
        }
    });
}

function nextPlayer(rewind)
{
    if(this.game.me == this.game.turn.player)
    {
        this.game.server.nextTurn(this.game.client.id);
    }
}

function drawAllSquads()
{
    this.game.players.forEach(function(player){
        player.drawAllSquads();
    });
}

/////////////////////////////////////////////////////////////////////////
//////////////////////////////// CREATE /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function clearGameCache (game) {
    this.game.cache = new Phaser.Cache(game);
    this.game.load.reset();
    this.game.load.removeAll();
}

function createFleat(game, player, fleatJson)
{
    var fleat = new oneFleat(fleatJson.name, player);
    fleat.game = game;
    fleatJson.deployedSquad.forEach(function(squadJson){
        fleat.deploySquad(createSquad(game, fleat, squadJson));
    });
    return fleat;
}

function createShip(game, shipJson)
{
    var theShip = new ship(shipJson);
    theShip.game = game;
    return theShip;   
}

function createLifeBar(game, armor, shield, maxArmor)
{
    var lifeBarobj = new lifeBar(armor, shield, maxArmor);
    lifeBarobj.game = game;
    return lifeBarobj;
}

function createSquad(game, fleat, squadJson)
{
     var squad = new oneSquad(squadJson.name, fleat);
     squad.currentDeployedIndex = squadJson.currentDeployedIndex;
     squad.game = game;
     squadJson.ships.forEach(function(shipJson){
        if(shipJson != null)
        {
            squad.addShip(createShip(game, shipJson));
        }
     });
     squad.createLifeBar();
     return squad;
}

function createPlayer(game, playerJson, number, availableCasePositioning, availableCaseDeploying, isMe)
{
    var player = new onePlayer(playerJson.name, number, availableCasePositioning, availableCaseDeploying, isMe);
    player.fleat = createFleat(game, player, playerJson.fleat );
    player.game = game;
    if(playerJson.fleat.capitalShip != null && playerJson.fleat.capitalShip != false)
    {
        player.fleat.addCapitalShip(playerJson.fleat.capitalShip);
    }

    player.createPick();
    return player;
}

function createOrder(game, orderJson)
{
    var orderObject = new oneOrder(orderJson.name, orderJson.effects);
    orderObject.game = game;
    return orderObject;
}

function createCases(casemap)
{
    var caseByLine = 4;
    var lines = 4;
    var caseTable = [];
    casemap.forEach(function(elem){
        let newCase = new oneCase(elem.name, elem.number, elem.height, elem.width);
        caseTable[elem.number] = newCase;
    });

    casemap.forEach(function(elem){
        caseTable[elem.number].left = (elem.links.left !== null) ? caseTable[elem.links.left] : null;
        caseTable[elem.number].right = (elem.links.right !== null) ? caseTable[elem.links.right] : null;
        caseTable[elem.number].topLeft = (elem.links.topLeft !== null) ? caseTable[elem.links.topLeft] : null;
        caseTable[elem.number].topRight = (elem.links.topRight !== null) ? caseTable[elem.links.topRight] : null;
        caseTable[elem.number].bottomLeft = (elem.links.bottomLeft !== null) ? caseTable[elem.links.bottomLeft] : null;
        caseTable[elem.number].bottomRight = (elem.links.bottomRight !== null) ? caseTable[elem.links.bottomRight] : null;
    });
    return caseTable;
}

