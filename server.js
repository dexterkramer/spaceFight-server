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
var eurecaServer = new EurecaServer({allow:['setId', 'unlockPositioning', 'sendPlayersInfos', 'unlockGame', 'refreshPlayersInfos', 'sendTurn', 'okToGame', 'sendWinner', 'sendDraw']});
 
//attach eureca.io to our http server
eurecaServer.attach(server);

server.listen(8000);

clients = [];

eurecaServer.exports.handshake = function(id)
{
    clients[id].remote.unlockPositioning();
    return true;
}

eurecaServer.exports.sendPositioningInfos = function(id, caseId)
{
    clients[id].game.players[clients[id].playerIndex].fleat.capitalShip.case = clients[id].game.caseTable[caseId];
    clients[id].game.caseTable[caseId].squad = clients[id].game.players[clients[id].playerIndex].fleat.capitalShip;
    clients[id].game.players[clients[id].playerIndex].fleat.deploySquad(clients[id].game.players[clients[id].playerIndex].fleat.capitalShip);
    clients[id].positioned = true;
    var allPositioned = true;
    clients[id].game.players.forEach(function(player, index){
        if(!clients[player.playerId].positioned)
        {
            allPositioned = false;
        }
    });
    if(allPositioned)
    {
        clients[id].game.gamePhase();
        clients[id].game.refreshPlayersInfos();
        clients[id].game.players.forEach(function(player, index){
            clients[player.playerId].remote.unlockGame();
        });
    }
    
    
    return true;
}

eurecaServer.exports.nextTurn = function(id)
{
    if(clients[id].game.players[clients[id].playerIndex] == clients[id].game.turn.player)
    {
        var indexChoosed = clients[id].game.nextTurn();
        clients[id].game.refreshPlayersInfos();
        clients[id].game.players.forEach(function(player, index){
            clients[player.playerId].remote.sendTurn(indexChoosed);
        });
        
    }
}


eurecaServer.exports.cardPlayed = function(id, currentCardIndex, caseIndex)
{
    if(clients[id].game.players[clients[id].playerIndex] == clients[id].game.turn.player)
    {
        clients[id].game.cardPlayed(currentCardIndex, clients[id].game.players[clients[id].playerIndex], caseIndex);
        clients[id].game.refreshPlayersInfos();
    }
}


eurecaServer.exports.squadGo = function(id, currentDeployedIndex, caseIndex)
{
    if(clients[id].game.players[clients[id].playerIndex] == clients[id].game.turn.player)
    {
        clients[id].game.move(currentDeployedIndex, clients[id].game.players[clients[id].playerIndex], caseIndex);
    }
    
}


eurecaServer.exports.okToGame = function(id)
{
    var self = this;
    var playerIndex = clients[id].game.players.findIndex(function(elem){
        return elem == clients[id].game.turn.player;
    });
    clients[id].remote.sendTurn(playerIndex);

    /*this.players.forEach(function(player, index){
        player.remote.sendTurn(playerIndex);
    });


    clients[id].inGame = true;
    var allInGame = true;
    clients[id].game.players.forEach(function(player, index){
        if(!clients[player.playerId].inGame)
        {
            allInGame = false;
        }
    });
    if(allInGame)
    {
        clients[id].game.gamePhase();
    }*/
    return true;
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
        pool[0].playerIndex = 0;
        pool[1].game = game;
        pool[1].playerIndex = 1;
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
    var game = boot.newGame(player1Json, player2Json);
    game.launchGame();
    return game;
}