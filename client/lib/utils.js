/////////////////////////////////////////////////////////////////////////
//////////////////////////////// CREATE /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function clearGameCache (game) {
    this.game.cache = new Phaser.Cache(game);
    this.game.load.reset();
    this.game.load.removeAll();
}

function createCard(game, player, object, type)
{
    var card = new oneCard(object, type);
    card.game = game;
    card.player = player;
    return card;
}

function createFleat(game, player, fleatJson)
{
    var fleat = new oneFleat(fleatJson.name, player);
    fleat.game = game;
    fleatJson.deployedSquad.forEach(function(squadJson){
        fleat.deploySquad(createSquad(game, fleat, squadJson));
    });
    return fleat;
}

function createShip(game, shipJson)
{
    var theShip = new ship(shipJson);
    theShip.game = game;
    return theShip;   
}

function createLifeBar(game, armor, shield, maxArmor)
{
    var lifeBarobj = new lifeBar(armor, shield, maxArmor);
    lifeBarobj.game = game;
    return lifeBarobj;
}

function createSquad(game, fleat, squadJson)
{
     var squad = new oneSquad(squadJson.name, fleat);
     squad.currentDeployedIndex = squadJson.currentDeployedIndex;
     squad.game = game;
     squadJson.ships.forEach(function(shipJson){
        if(shipJson != null)
        {
            squad.addShip(createShip(game, shipJson));
        }
     });
     squad.createLifeBar();
     return squad;
}

function createPlayer(game, playerJson, number, isMe)
{
    var player = new onePlayer(playerJson.name, number, isMe);
    player.fleat = createFleat(game, player, playerJson.fleat );
    player.game = game;
    if(playerJson.fleat.capitalShip != null && playerJson.fleat.capitalShip != false)
    {
        player.fleat.addCapitalShip(playerJson.fleat.capitalShip);
    }

    return player;
}

function createOrder(game, orderJson)
{
    var orderObject = new oneOrder(orderJson.name, orderJson.effects);
    orderObject.game = game;
    return orderObject;
}

function createCases(casemap)
{
    var caseByLine = 4;
    var lines = 4;
    var caseTable = [];
    casemap.forEach(function(elem){
        let newCase = new oneCase(elem.name, elem.number, elem.height, elem.width);
        caseTable[elem.number] = newCase;
    });

    casemap.forEach(function(elem){
        caseTable[elem.number].left = (elem.links.left !== null) ? caseTable[elem.links.left] : null;
        caseTable[elem.number].right = (elem.links.right !== null) ? caseTable[elem.links.right] : null;
        caseTable[elem.number].topLeft = (elem.links.topLeft !== null) ? caseTable[elem.links.topLeft] : null;
        caseTable[elem.number].topRight = (elem.links.topRight !== null) ? caseTable[elem.links.topRight] : null;
        caseTable[elem.number].bottomLeft = (elem.links.bottomLeft !== null) ? caseTable[elem.links.bottomLeft] : null;
        caseTable[elem.number].bottomRight = (elem.links.bottomRight !== null) ? caseTable[elem.links.bottomRight] : null;
    });
    return caseTable;
}

function createDamageModifier(damageModifier, turns)
{
    var attackModifier = new AttackModifier(turns);
    attackModifier.setDamageModifier(damageModifier);
    return attackModifier;
}

function createBattle(suqad, target)
{
    var theBattle = new battle(suqad, target);
    return theBattle;
}

function createPick(player)
{
    var pick = new onePick(player);
    pick.initPick();
    return pick;
}

function createCaptain(game, player, captainJson)
{
    var theCaptain = new captain(game, player, captainJson.name, captainJson.effects);
    theCaptain.currentCaptainIndex = captainJson.currentCaptainIndex;
    return theCaptain;
}

function createCaptains (game, player, captainsJson)
{
    var captainsArray = [];
    captainsJson.forEach(function(c){
        captainsArray.push(createCaptain(game, player, c));
    });
    return captainsArray;
}

function createSquadEffect(effectJson)
{
    var squadEffect = null;
    if(effectJson.type == "lifePoint")
    {
        if(effectJson.valueType == "absolute")
        {
            squadEffect = new increaseLifeEffect(effectJson.value);
        }
        else if(effectJson.valueType == "relative")
        {
            squadEffect = new increasePercentLifeEffect(effectJson.value);
        }
    }
    else if(effectJson.type == "damage")
    {
        if(effectJson.valueType == "absolute")
        {
            squadEffect = new increaseDamageEffect(effectJson.value);
        }
        else if(effectJson.valueType == "relative")
        {
            squadEffect = new increasePercentDamageEffect(effectJson.value);
        }
    } 
    return squadEffect;
}