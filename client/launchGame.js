function launchGame()
{
    var game = new Phaser.Game(1000, 900, Phaser.AUTO, '', { create: eurecaClientSetup, update:updateGame });
    game.state.add("Boot",new boot(game));
    game.state.add("Preload",new preload(game));
    game.state.add("Positionning",new positionning(game));
    game.state.add("TheGame",new TheGame(game));
    return game;
}

function createGame(eurecaClient, eurecaServer)
{
    game.server = eurecaServer;
    game.client = eurecaClient;
    game.client.game = game;
}

function updateGame()
{
    
    if(typeof game.client != "undefined" && game.client != null && game.client.lock >= 1)
    {
        game.state.start("Boot");
    }
}