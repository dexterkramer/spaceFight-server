var onePick = function(player)
{
    this.player = player;
    this.pile = [];
}

onePick.prototype = {
    initPick : function()
    {
    },
    drawOne : function()
    {
        if(this.pile.length > 0)
        {
            let selectIndex = Math.floor(Math.random()*this.pile.length);
            var selectedCard = this.pile[selectIndex];
            this.pile.splice(selectIndex,1);
            return selectedCard;
        }
        return false;
    }
};

function createPick(player)
{
    var pick = new onePick(player);
    pick.initPick();
    return pick;
}