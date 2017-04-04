var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        //this.game.infos = { tourInfos : null};
        this.gameController.drawCases();
        this.gameController.turn.player = this.gameController.me;
        this.gameController.positioningTurnInit(this.gameController.turn.player);
      },
    update : function(){
        this.gameController.caseTable.forEach(function(oneCase){
            oneCase.NotOverLaped();
        });
        this.gameController.checkOverLapSquad(this.gameController.turn.player,this.gameController.turn.player.availableCasePositioning, this.gameController.OverLapPositioningDraggingManagment.bind(this.gameController));   
        if(this.gameController.goGaming)
        {
            this.gameController.finishPositioning();
        }
    }
}