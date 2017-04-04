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
        if(this.gameController.turn.player == this.gameController.me)
        {
            this.gameController.caseTable.forEach(function(oneCase){
                oneCase.NotOverLaped();
            });
            this.gameController.checkOverLapSquad(this.gameController.me,this.gameController.caseTable, this.gameController.OverLapGamingDraggingManagment.bind(this.gameController));
            this.gameController.checkOverLapCard(this.gameController.me,this.gameController.caseTable, this.gameController.me.availableCaseDeploying, this.gameController.OverLapGamingCardDraggingManagment.bind(this.gameController));
        }
    }
}