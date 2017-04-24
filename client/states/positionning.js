var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        //this.game.infos = { tourInfos : null};
        this.gameController.drawCases();
        this.gameController.turn.player = this.gameController.me;
        this.positioningInit(this.gameController.turn.player);
      },
    update : function(){
        this.gameController.caseTable.forEach(function(oneCase){
            oneCase.NotOverLaped();
        });
        this.checkOverLapSquad(this.gameController.turn.player,this.gameController.turn.player.availableCasePositioning);   
        if(this.gameController.goGaming)
        {
            this.gameController.cleanPhaserObjectReferences();
            this.gameController.finishPositioning();
        }
    },
    checkOverLapSquad : function(player, caseTable)
    {
        var ref = this;
        player.fleat.deployedSquad.forEach(function(squad){
            if(squad.isDragged)
            {
                squad.overlapedCase = ref.gameController.getOverlapedCase(caseTable);
                ref.OverLapDraggingManagment(squad);
            }
        });
    },
    OverLapDraggingManagment : function(squad)
    {
        if(squad.overlapedCase !== null && squad.overlapedCase.squad !== null && squad.overlapedCase.squad !== squad)
        {
            squad.overlapedCase.BadOverLaped();
        }
        else if(squad.overlapedCase !== null)
        {
            squad.overlapedCase.OverLaped(); 
        }
    },
    dragSquad : function(sprite, pointer)
    {
        sprite.body.moves = false;
        sprite.ref.isDragged = true;
    },
    stopDragSquad : function(sprite, pointer)
    {
        sprite.body.moves = false;
        sprite.ref.isDragged = false;
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
    },
    positioningInit : function(player)
    {
        this.refreshInfos();
        this.positioningPlayer(player);
        this.gameController.game.add.button(600, 600, 'button', this.positioningNextTurn, this, 1, 0, 1);
    },
    positioningPlayer : function(player)
    {
         var XposSquad = 100;
         var YposSquad = 700;
 
         player.fleat.capitalShip.originalX = XposSquad;
         player.fleat.capitalShip.originalY = YposSquad;
 
         player.fleat.deploySquad(player.fleat.capitalShip);
         player.fleat.capitalShip.enableDrag(this.dragSquad, this.stopDragSquad, this);
     }, 
    refreshInfos : function()
    {
        if(this.gameController.infos.tourInfos != null && this.gameController.infos.tourInfos.phaserObject != null)
        {
            this.gameController.infos.tourInfos.phaserObject.destroy();
        }
        if(this.gameController.turn.player != null)
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = this.gameController.turn.player.name+ " place your capital ship !";
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.gameController.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.gameController.infos.tourInfos = {};
            this.gameController.infos.tourInfos.phaserObject = text;
        }
    },
    positioningNextTurn : function()
    {
        if(this.gameController.turn.player.okToFinishPositioning())
        {
            this.gameController.turn.player.disableDragingAllSquads();
            this.gameController.server.sendPositioningInfos(this.gameController.client.id, this.gameController.turn.player.fleat.capitalShip.case.number); 
        }
    },
    unlockMe : function()
    {
        var ref = this;
        this.gameController.me.fleat.deployedSquad.forEach(function(squad){
            squad.enableDrag(ref.dragSquad, ref.stopDragSquad, ref);
        });
    },
    lockMe : function()
    {
        var ref = this;
        this.gameController.me.fleat.deployedSquad.forEach(function(squad){
            squad.disableDrag();
        });
    },
}