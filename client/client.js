//

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	var id;
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	eurecaClient.lock = 0;
	eurecaClient.game = null;
	
	eurecaClient.ready(function (proxy) {		
		eurecaServer = proxy;
		//eurecaServer = proxy;
		
		//we temporary put create function here so we make sure to launch the game once the client is ready
		
		ready = true;
	});	

	eurecaClient.exports.unlockPositioning = function() 
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		eurecaClient.lock = 2;
	}

	eurecaClient.exports.unlockGame = function()
	{
		eurecaClient.lock = 3;
	}

	eurecaClient.exports.sendPlayersInfos = function(playersInfos, id)
	{
		eurecaClient.id = id;
		create(eurecaClient, eurecaServer);
		if(eurecaClient.game != null)
		{
			eurecaClient.game.tempPlayerInfos = playersInfos;
			eurecaClient.lock = 1;
		}
	}

}