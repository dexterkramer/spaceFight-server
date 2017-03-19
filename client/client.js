//

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	var id;
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	var lock = 0;
	
	eurecaClient.ready(function (proxy) {		
		eurecaServer = proxy;
		//eurecaServer = proxy;
		
		//we temporary put create function here so we make sure to launch the game once the client is ready
		
		ready = true;
	});	

	eurecaClient.exports.setId = function(id) 
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		this.id = id;

		//create();
		eurecaServer.handshake(id);
		ready = true;
	},

	eurecaClient.exports.unlockPositioning = function() 
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		this.lock = 1;
		create(this, eurecaServer);
	}

}