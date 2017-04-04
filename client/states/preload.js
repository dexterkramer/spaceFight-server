var preload = function(game){}

preload.prototype = {
	preload: function(){ 
                //clearGameCache(this.game);
                this.game.load.json('casemap', 'assets/cases.json');
                this.game.load.json('player1', 'assets/player1.json');
                this.game.load.json('player2', 'assets/player2.json');
                this.game.load.image('squad', 'assets/squad.png');
                this.game.load.image('case', 'assets/case2.png');
                this.game.load.image('overLapedCase', 'assets/moveOveralped.png');
                this.game.load.image('supportLapedCase', 'assets/overlapedSupportCase.png');
                this.game.load.image('badOverLapedCase', 'assets/badOverLapedCase.png');
                this.game.load.spritesheet('button', 'assets/nextButton.PNG', 125, 55);
                this.game.load.image('space', 'assets/deep-space.jpg');
                this.game.load.image('attackOverLaped', 'assets/attackOverLaped.png');
                this.game.load.image('red-arrow', 'assets/red-arrow.png');
                this.game.load.image('card', 'assets/card.jpg');  
	},
        create: function(){
                this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
                this.gameController.setCaseTable(createCases(this.game.cache.getJSON('casemap')));
	},
        update : function()
        {
                if(this.gameController.IsLoaded)
                {
                        this.gameController.players[0].availableCasePositioning = this.gameController.caseTable.slice( 12 , 19);
                        this.gameController.players[0].availableCaseDeploying = this.gameController.caseTable.slice( 16 , 19);
                        this.gameController.players[1].availableCasePositioning = this.gameController.caseTable.slice( 0 , 7 );
                        this.gameController.players[1].availableCaseDeploying = this.gameController.caseTable.slice( 0 , 3 );
                        this.gameController.startPositioning();
                }
        }
}
