//

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function(onConnect) {
	var id;
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	eurecaClient.lock = 0;
	eurecaClient.game = null;
	eurecaClient.gameController = null;
	
	eurecaClient.ready(function (proxy) {	
		onConnect(proxy);	
		//eurecaServer = proxy;
		//eurecaServer = proxy;
		
		//we temporary put create function here so we make sure to launch the game once the client is ready
		
		ready = true;
	});	

	eurecaClient.setId = function(id)
	{
		eurecaClient.id = id;
	}

	eurecaClient.exports.unlockGame = function()
	{
		eurecaClient.lock = 3;
	}

	eurecaClient.exports.sendPlayersInfos = function(playersInfos, id)
	{
		//eurecaClient.id = id;
		//createGame(eurecaClient, eurecaServer);
		if(eurecaClient.gameController != null)
		{
			eurecaClient.gameController.addPlayer(playersInfos.players[0], playersInfos.index === 0);
			eurecaClient.gameController.addPlayer(playersInfos.players[1], playersInfos.index === 1);
			eurecaClient.gameController.setMe(playersInfos.index);
			eurecaClient.gameController.IsLoaded = true;
		}
		return true;
	}

	eurecaClient.exports.sendTurn = function(playerIndex)
	{
		
		while(eurecaClient.game.refreshing);
		eurecaClient.game.turn.player = eurecaClient.game.players[playerIndex];
		if(eurecaClient.game.turn.player == eurecaClient.game.me)
		{
			refreshInfos();
			unlockMe();
		}
		else
		{
			refreshInfos();
			lockMe();
		}
		return true;
	}

	eurecaClient.exports.refreshPlayersInfos = function(playersInfos)
	{
		eurecaClient.game.tempPlayerInfos = playersInfos;
		eurecaClient.game.refreshing = true;
		refreshPlayers();
		eurecaClient.game.refreshing = false;
		return true;
	}

	eurecaClient.exports.sendWinner = function(playerIndex)
	{
		eurecaClient.game.winner = eurecaClient.game.players[playerIndex];
		eurecaClient.game.end = 1;
	}

	eurecaClient.exports.sendDraw = function()
	{
		eurecaClient.game.draw = true;
		eurecaClient.game.end = 1;
	}
	return eurecaClient;
}