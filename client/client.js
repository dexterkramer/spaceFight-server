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
		ready = true;
	});	

	eurecaClient.exports.setId = function(id)
	{
		eurecaClient.id = id;
	}

	eurecaClient.exports.unlockGame = function()
	{
		eurecaClient.gameController.goGaming = true;
	}

	eurecaClient.exports.sendPlayersInfos = function(playersInfos, id)
	{
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
		while(eurecaClient.gameController.refreshing);
		eurecaClient.gameController.turn.player = eurecaClient.gameController.players[playerIndex];
		if(eurecaClient.gameController.turn.player == eurecaClient.gameController.me)
		{
			eurecaClient.gameController.refreshInfos();
			eurecaClient.gameController.unlockMe();
		}
		else
		{
			eurecaClient.gameController.refreshInfos();
			eurecaClient.gameController.lockMe();
		}
		
		return true;
	}

	eurecaClient.exports.refreshPlayersInfos = function(playersInfos)
	{
		eurecaClient.gameController.refreshing = true;
		eurecaClient.gameController.refreshPlayers(playersInfos);
		eurecaClient.gameController.refreshing = false;
		return true;
	}

	eurecaClient.exports.sendWinner = function(playerIndex)
	{
		eurecaClient.gameController.winner = eurecaClient.gameController.players[playerIndex];
		eurecaClient.gameController.end = 1;
	}

	eurecaClient.exports.sendDraw = function()
	{
		eurecaClient.gameController.draw = true;
		eurecaClient.gameController.end = 1;
	}
	return eurecaClient;
}