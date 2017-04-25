var ShipFactory = require('./ship.js');
var lifeBarFactory = require("./lifeBar.js");
var attackModifierFactory = require("./attackModifier.js");

var oneSquad = function(name, fleat)
{
    this.name = name;
    this.fleat = fleat;
    this.ships = [];
    this.case = null;
    this.action = null;
    this.defendAgainst = [];
    this.movesAllowed = 1;
    this.movedFrom = [];
    this.tempAction = null;
    this.attackModifiersArray = [];
    this.lifeBar = null;
    this.captain = null;
    this.currentDeployedIndex = null;
};

oneSquad.prototype = {
    addCaptain : function(captain)
    {   
        this.captain = captain;
        this.captain.setSquad(this);
        this.captain.init();
    },
    createSquadInfos : function(mask)
    {
        var squadInfos = {};
        squadInfos.name = this.name;
        if(mask.case)
        {
            if(this.case == null)
            {
                squadInfos.case = null;
            }
            else
            {
                squadInfos.case = this.case.createCaseInfos(mask.case);
            }
        }
        squadInfos.currentDeployedIndex = this.currentDeployedIndex;
        if(mask.movesAllowed)
        {
            squadInfos.movesAllowed = this.movesAllowed;
        }
        if(mask.attackModifiersArray)
        {
            squadInfos.attackModifiersArray = [];
            this.attackModifiersArray.forEach(function(attackModifier){
                squadInfos.attackModifiersArray.push(attackModifier.createAttackModifierInfos(mask.attackModifiersArray));
            });
        }
        if(mask.ships)
        {
            squadInfos.ships = [];
            this.ships.forEach(function(ship){
                squadInfos.ships.push(ship.createShipInfos(mask.ships));
            });
        }
        if(mask.lifeBar)
        {
            squadInfos.lifeBar = this.lifeBar.createLifeBarInfos(mask.lifeBar);
        }
        return squadInfos;
    },
    buff : function(order)
    {
        var ref = this;
        order.effects.forEach(function(effect){
            if(effect.type == "damage")
            {
                ref.attackModifiersArray.push(attackModifierFactory.createDamageModifier(effect.value, -1));
            }
        });
    },
    addShip : function(ship)
    {
        ship.currentShipIndex = this.currentShipIndex;
        this.ships.push(ship);
        this.currentShipIndex++;
    },
    createLifeBar : function()
    {
        var totalArmor = 0;
        var totalShield = 0;
        var totalMaxArmor = 0;
        this.ships.forEach(function(ship){
            totalArmor += ship.lifeBar.armor;
            totalShield += ship.lifeBar.shield;
            totalMaxArmor += ship.lifeBar.maxArmor;
        });
        this.lifeBar = lifeBarFactory.create(totalArmor, totalShield, totalMaxArmor);
    },
    updateLifeBar : function()
    {
        var totalArmor = 0;
        var totalShield = 0;
        this.ships.forEach(function(ship){
            totalArmor += ship.lifeBar.armor;
            totalShield += ship.lifeBar.shield;
        });
        this.lifeBar.setArmor(totalArmor);
        this.lifeBar.setShield(totalShield);
    },
    calculFirePower : function()
    {
        var totalFirePower = 0;
        this.ships.forEach(function(ship){
            if(ship.lifeBar.armor > 0)
            {
                totalFirePower += ship.infos.firePower;
            }
        });
        return totalFirePower;
    },
    removeFromBattle : function()
    {
        this.fleat.undeploySquad(this);
        this.case.squad = null;
        this.case = null;
        if(this == this.fleat.capitalShip)
        {
            this.fleat.player.loose = true;
        }
    },
    applyDamages : function()
    {
        this.ships.forEach(function(ship){
            ship.lifeBar.armor = ship.lifeBar.finalArmor;
        });
        
    },
    initFinalArmor : function()
    {
        this.ships.forEach(function(ship){
            ship.lifeBar.finalArmor = ship.lifeBar.armor; 
        });
    },
    getAvailableShips : function()
    {
        var shipArray = [];
        this.ships.forEach(function(ship, index){
            if(ship.lifeBar.armor > 0)
            {
                ship.lifeBar.tempArmor = ship.lifeBar.armor;
                shipArray.push(ship);
            }
        });
        return shipArray;
    },
    canGo : function(oneCase)
    {
        if(this.case !== null)
        {
            if(this.case.left == oneCase)
            {
                return 1;
            }   
            if(this.case.topLeft == oneCase)
            {
                return 2;
            }
            if(this.case.topRight == oneCase)
            {
                return 3;
            }
            if(this.case.right == oneCase)
            {
                return 4;
            }
            if(this.case.bottomRight == oneCase)
            {
                return 5;
            }
            if(this.case.bottomLeft == oneCase)
            {
                return 6;
            }
        }
        return false;
    },
    calcultateFlankingBonus : function(defendingSquad, defendingAgainst)
    {
        //var defendingAgainst = getDefendingAgainst(defendingSquad);

        if(defendingAgainst.length > 0 && defendingAgainst[0].attackingSquad != this)
        {
            var firstToAttack = defendingAgainst[0].attackingSquad;
            var firstToAttackFromFlankNumber = defendingSquad.canGo(firstToAttack.case);
            var attackedFromFlankNumber = defendingSquad.canGo(this.case);
            var plusOne = (attackedFromFlankNumber == 6) ? 1 : attackedFromFlankNumber + 1;
            var lessOne = (attackedFromFlankNumber == 1) ? 6 : attackedFromFlankNumber - 1;
            var plusThree = ((attackedFromFlankNumber + 3) > 6) ? attackedFromFlankNumber + 3 - 6: attackedFromFlankNumber + 3;
            if(firstToAttackFromFlankNumber == plusOne || firstToAttackFromFlankNumber == lessOne)
            {
                return false;
            }
            else if(firstToAttackFromFlankNumber == plusThree)
            {
                return attackModifierFactory.createDamageModifier(2,1);
            }
            else
            {
                return attackModifierFactory.createDamageModifier(1.5,1);
            }
        }
        return false;
    },
    getFriendlyFire : function(defendingSquad, defendingAgainst)
    {
        var ref = this;
        var toFriendlyFire = [];
        if(defendingAgainst.length > 0)
        {
            defendingAgainst.forEach(function(battle){
                var hasAttackedFromFlankNumber = defendingSquad.canGo(battle.attackingSquad.case);
                var attackedFromFlankNumber = defendingSquad.canGo(ref.case);
                var plusOne = (attackedFromFlankNumber == 6) ? 1 : attackedFromFlankNumber + 1;
                var lessOne = (attackedFromFlankNumber == 1) ? 6 : attackedFromFlankNumber - 1;
                if(hasAttackedFromFlankNumber == plusOne || hasAttackedFromFlankNumber == lessOne)
                {
                    toFriendlyFire.push(battle.attackingSquad);
                }
            });
        }
        return toFriendlyFire;
    },
    applyFriendlyFire : function(toFriendlyFire)
    {
        var ref = this;
        toFriendlyFire.forEach(function(squad){
            var modifiers = [];
            modifiers.push(attackModifierFactory.createDamageModifier(0.1,1));
            ref.attack(squad, modifiers);
            squad.applyDamages();
            squad.updateLifeBar();
            if(squad.lifeBar.armor <= 0)
            {
                squad.removeFromBattle();
            }
        });
    },
    attack : function(defendingSquad, modifiers)
    {
        var attackingModifierArrayTmp = this.attackModifiersArray.slice(0,this.attackModifiersArray.length);
        if(typeof modifiers != "undefined" && modifiers != null)
        {
            modifiers.forEach(function(modifier){
                if(modifier.type == "AttackModifier")
                {
                    attackingModifierArrayTmp.push(modifier);
                }
            });
        }
        
        var attackingShipArray = this.getAvailableShips();
        var defendingShipArray = defendingSquad.getAvailableShips();
        var shipGroups = [];
        while(attackingShipArray.length > 0)
        { 
            let i;
            let selectedShips = [];
            // ships focus ennemies ship 3 v 1 
            for(i = 0; i < 3 && attackingShipArray.length > 0; i++)
            {
                let selectIndex = Math.floor(Math.random()*attackingShipArray.length);
                selectedShips.push(attackingShipArray[selectIndex]);
                attackingShipArray.splice(selectIndex, 1);
            }
            shipGroups.push(selectedShips);
        }
        var ref = this;
        shipGroups.forEach(function(shipGroup){
            if(defendingShipArray.length >= 0)
            {
                let selectedEnnemyIndex = Math.floor(Math.random()*defendingShipArray.length);
                shipGroup.forEach(function(ship){
                    if(typeof defendingShipArray[selectedEnnemyIndex] !== "undefined")
                    {
                        ship.attack(defendingShipArray[selectedEnnemyIndex], attackingModifierArrayTmp);
                        if(defendingShipArray[selectedEnnemyIndex].lifeBar.tempArmor <= 0)
                        {
                            defendingShipArray.splice(selectedEnnemyIndex, 1);
                        }
                    }
                });
            }
        });
        //ref.movesAllowed = 0;
    },
    getAvailableSupportedShip : function()
    {
        var shipArray = [];
        this.ships.forEach(function(ship, index){
            if(ship.lifeBar.armor > 0 && ship.lifeBar.armor < ship.lifeBar.maxArmor)
            {
                shipArray.push(ship);
            }
        });
        return shipArray;
    },
    support : function(target)
    {
        var supportingShipArray = this.getAvailableShips();
        var targetShipArray = target.getAvailableSupportedShip();
        if(targetShipArray.length == 0 || supportingShipArray.length == 0)
        {
            return false;
        }
        supportingShipArray.forEach(function(ship){
            let selectedTargetIndex = Math.floor(Math.random()*targetShipArray.length);
            targetShipArray[selectedTargetIndex].lifeBar.armor += ship.infos.support;
            if(targetShipArray[selectedTargetIndex].lifeBar.armor >= targetShipArray[selectedTargetIndex].lifeBar.maxArmor)
            {
                targetShipArray[selectedTargetIndex].lifeBar.armor = targetShipArray[selectedTargetIndex].lifeBar.maxArmor;
                targetShipArray.splice(selectedTargetIndex, 1);
            }
        });
        // after supporting a squad, one squad cannot move but can perform an attack, with -70% damages
        this.movesAllowed = 0;
        this.addAttackModifier(attackModifierFactory.createDamageModifier(0.7,1));
        return true;
    },
    addAttackModifier : function(attackModifier)
    {
        this.attackModifiersArray.push(attackModifier);
    },
    resetModifiers : function()
    {
        var toRemove = [];
        this.attackModifiersArray.forEach(function(modifier, index){
            modifier.turns -= 1;
            if(modifier.turns == 0)
            {
                toRemove.push(index);
            }
        });
        var ref = this;
        toRemove.forEach(function(indexToRemove){
            ref.attackModifiersArray.splice(indexToRemove, 1);
        });
    }
};

module.exports = {
    createSquad : function(fleat, squadJson)
    {
        var squad = new oneSquad(squadJson.name, fleat);
        squadJson.ships.forEach(function(shipJson){
            squad.addShip(ShipFactory.createShip(shipJson));
        });
        squad.createLifeBar();
        return squad;
    }
}