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
            captain : {
                name : true,
                effects : true
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
            activeEffects : {
                type : true,
                valueType : true,
                value : true,
                isApplyed : true
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