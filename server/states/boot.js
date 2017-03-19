var caseMap = require("./../../assets/cases.json");
var playerFactory = require('./../objects/player.js');
var caseFactory = require('./../objects/case.js');
var turnFactory = require('./../objects/turn.js');
var Game = require("../objects/game.js");

module.exports = {
    newGame : function(player1, player2)
    {
        var game = new Game;
        game.caseTable = caseFactory.createCases(caseMap);
        game.players.push(playerFactory.createPlayer(player1, 0, game.caseTable.slice( 12 , 19), game.caseTable.slice( 16 , 19)));
        game.players.push(playerFactory.createPlayer(player2, 1, game.caseTable.slice( 0 , 7 ), game.caseTable.slice( 0 , 3 )));
        game.turn = turnFactory.createTurn();
        return game;
    }
};
