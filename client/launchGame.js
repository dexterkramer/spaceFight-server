function launchGame()
{
    var game = new Phaser.Game(1000, 900, Phaser.AUTO, '', { create: eurecaClientSetup, update:updateGame });
    game.state.add("Boot",boot);
    game.state.add("Preload",preload);
    game.state.add("Positionning", positionning);
    game.state.add("TheGame", TheGame);
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