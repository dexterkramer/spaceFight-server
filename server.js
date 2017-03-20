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
var eurecaServer = new EurecaServer({allow:['setId', 'unlockPositioning', 'sendPlayersInfos', 'unlockGame']});
 
//attach eureca.io to our http server
eurecaServer.attach(server);

server.listen(8000);

clients = [];

eurecaServer.exports.handshake = function(id)
{
    clients[id].remote.unlockPositioning();
}

eurecaServer.exports.sendPositioningInfos = function(id, caseId)
{
    clients[id].player.fleat.capitalShip.case = clients[id].game.caseTable[caseId];
    clients[id].remote.unlockGame();
}




//detect client connection
eurecaServer.onConnect(function (conn) {    

    var remote = eurecaServer.getClient(conn.id); 

    //register the client
	clients[conn.id] = {id:conn.id, remote:remote, game:null}

    var pool = tryToMakeMatch();

    if(pool)
    {
        var game = launchGame(pool[0],pool[1]);
        pool[0].game = game;
        pool[0].player = game.players[0];
        pool[1].game = game;
        pool[1].player = game.players[1];
        //here we call setId (defined in the client side)
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
    for(var c in clients)
    {   
        if(pool.length > 1)
            return ;
        if(clients[c].game == null)
        {
            pool.push(clients[c]);
        }   
    }
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
    player1Json.remote = player1.remote;
    player2Json.remote = player2.remote;
    player1Json.playerId = player1.id;
    player2Json.playerId = player2.id;
    var game = boot.newGame(player2Json, player1Json);
    game.launchGame();
    return game;
}