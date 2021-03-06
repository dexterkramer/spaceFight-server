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
            },
            captain : {
                name : true,
                effects : true
            }
        },
        captains : {
            name : true,
            effects : true
        },
        deployedSquad : {
            case : {
                number : true
            },
            activeEffects : {
                type : true,
                valueType : true,
                value : true,
                isApplyed : true
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
            lifeBar : {
                armor : true,
                shield : true,
                maxArmor : true,
                finalArmor : true
            }
        },
    },
    cards : {
        type : true,
        object : {
            squad : {
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
            captain : {
                name : true,
                effects : true
            },
        }
    }
}

module.exports = playerInfosMask;