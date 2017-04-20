var ennemyInfosMask = {
    fleat : {
        capitalShip : false,
        deployedSquad : {
            case : {
                number : true
            },
            movesAllowed : true,
            attackModifiersArray : {
                type : true,
                turns : true,
                damageModifier : true
            },
            ships : {
                infos : true,
                lifeBar : {
                    armor : true,
                    shield : true,
                    maxArmor : true,
                    finalArmor : true
                }
            },
            lifeBar : {
                armor : true,
                shield : true,
                maxArmor : true,
                finalArmor : true
            }
        },
    },
    captains : false,
    cards : {
        type : false,
        object : false
    }
}

module.exports = ennemyInfosMask;