var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);

var player1Json = require("./assets/player1.json");
var player2Json = require("./assets/player2.json");
var boot = require("./server/states/boot.js");

// serve static files from the current directory
app.use(express.static(__dirname));


//get EurecaServer class
var EurecaServer = require('eureca.io').EurecaServer;
 
//create an instance of EurecaServer
var eurecaServer = new EurecaServer({allow:['setId']});
 
//attach eureca.io to our http server
eurecaServer.attach(server);

server.listen(8000);

clients = [];

eurecaServer.exports.handshake = function(id)
{
    //var remote = eurecaServer.getClient(id); 

    console.log(clients[id]);
    //console.log(clients[id]);
	//var conn = this.connection;
	/*for (var c in clients)
	{
        //console.log("bondour !! t kev adams !!");
		//console.log(clients[c]);
    }*/
}




//detect client connection
eurecaServer.onConnect(function (conn) {    

    var remote = eurecaServer.getClient(conn.id); 

    //register the client
	clients[conn.id] = {id:conn.id, remote:remote}
	
    //console.log(remote);

	//here we call setId (defined in the client side)
	remote.setId(conn.id);
    var pool = tryToMakeMatch();
    //console.log("icic" + pool);
    if(pool)
    {
        var game = launchGame(pool[0],pool[1]);
        pool[0].game = game;
        pool[1].game = game;
    }
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
});



//detect client disconnection
eurecaServer.onDisconnect(function (conn) {    
    console.log('Client disconnected ', conn.id);
});


function tryToMakeMatch()
{
    var pool = [];
    clients.forEach(function(client){
        if(pool.length > 1)
            return ;
        if(!client.inGame)
        {
            pool.push(client);
        }   
    });
    if(pool.length == 2)
    {
        return pool;
    }
    else
    {
        return false;
    }
}

function launchGame(player1, player2)
{
    player1.inGame = true;
    player2.inGame = true;
    player1Json.conn = player1;
    player2Json.conn = player2;
    var game = boot.newGame(player2Json, player1Json);
    game.launchGame();
    return game;
}