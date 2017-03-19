var Game = function()
{
    this.players = [];
    this.state = null;
}

Game.prototype = {
    launchGame : function()
    {
        this.players.forEach(function(player){
            //console.log(player.conn);
        });
        //var positioning = new positionning(game);
        //positioning.create();
    },
    nextPlayer : function(rewind)
    {
        if(this.turn.player == null)
        {
            if(typeof this.players[0] !== "undefined" && this.players[0] !== null)
            {
                this.turn.player = this.players[0];
            }        
            return this.turn.player;
        }
        if(typeof this.players[this.turn.player.number + 1] !== "undefined" && this.players[this.turn.player.number + 1] !== null)
        {
            this.turn.player = this.players[this.turn.player.number + 1];
        }
        else
        {
            if(typeof rewind == "undefined" || rewind == true)
            {
                this.turn.player = this.players[0];
            }
            else
            {
                this.turn.player = null;
            }
        }
        return this.turn.player;
    },
};

module.exports = Game;
