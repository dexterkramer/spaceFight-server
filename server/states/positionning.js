var positionning = function(game){
    this.game = game;
};
  
positionning.prototype = {
  	create: function(){
        this.game.infos = { tourInfos : null};
        //drawCases();
        //nextPlayer(false);
        //positioningTurnInit(this.game.players);
      }
}

function positioningTurnInit(player)
{
    refreshInfosPositioning();
    positioningPlayer(player);
}

function finish()
{
    game.state.start("TheGame");
}

function positioningNextTurn()
{
    if(this.game.turn.player.okToFinishPositioning())
    {
        nextPlayer(false);
        if(this.game.turn.player !== null)
        {
            positioningTurnInit(this.game.turn.player);
        }
        else
        {
            finish();
        }
    }
}

function positioningPlayer(player)
{
    player.fleat.deploySquad(player.fleat.capitalShip);
    enableDragSquad(player.fleat.capitalShip, dragSquad, stopDragSquad);
}

function refreshInfosPositioning()
{
    if(this.game.infos.tourInfos != null && this.game.infos.tourInfos.phaserObject != null)
    {
        this.game.infos.tourInfos.phaserObject.destroy();
    }
    if(this.game.turn.player != null)
    {
        var infosTourX = 700;
        var infosTourY = 100;
        var textTour = this.game.turn.player.name+ " place your capital ship !";
        var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
        text.anchor.set(0 , 0);
        this.game.infos.tourInfos = {};
        this.game.infos.tourInfos.phaserObject = text;
    }
}