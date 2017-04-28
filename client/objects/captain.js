var captain = function(game, player, name, effects)
{
    this.player = player;
    this.name = name;
    this.effects = effects;
    this.game = game;
    this.squad = null;
    this.phaserObject = null;
    this.currentCaptainIndex = null;
}

captain.prototype = {
    destroy : function()
    {
        if(this.phaserObject != null)
        {
            this.phaserObject.destroy();
            this.phaserObject = null;
        }
    },
    setSquad : function(squad)
    {
        this.squad = squad;
    },
    drawCaptain : function()
    {
        var oneCaptain = this.game.add.sprite(0, 0, 'captain');
        oneCaptain.scale.setTo(50 / oneCaptain.width, 50 / oneCaptain.height);
        oneCaptain.anchor.x = 0.5;
        oneCaptain.anchor.y = 0.5;
        this.squad.phaserObject.addChild(oneCaptain);
        this.phaserObject = oneCaptain;
    },
};
