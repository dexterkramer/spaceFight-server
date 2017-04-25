var increaseLifeEffect = function(value, squad)
{
    this.value = value;
    this.squad = squad;
    this.isApplyed = false;
}

increaseLifeEffect.prototype = {
    applyEffect : function()
    {
        this.isApplyed = true;
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.setAdditionalLife( ref, ((ref.squad.ships.length > 0) ? (ref.value / ref.squad.ships.length) : 0) );
        });
    },
    removeEffect : function()
    {
        var ref = this;
        this.squad.ships.forEach(function(ship){
            ship.lifeBar.removeAdditionalLife(ref);
        });
    }
}