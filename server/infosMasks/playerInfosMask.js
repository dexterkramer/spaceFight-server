var playerInfosMask = {
    fleat : {
        capitalShip : {
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
    cardHandlers : {
        card : {
            type : true,
            object : true
        }
    }
}

module.exports = playerInfosMask;