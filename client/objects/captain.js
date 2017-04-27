var captain = function(game, player, name, effects)
{
    this.player = player;
    this.name = name;
    this.effects = effects;
    this.game = game;
    this.squad = null;
}

captain.prototype = {
    destroy : function()
    {
        
    }
};
