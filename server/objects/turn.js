var oneTurn = function()
{
    this.player = null;
}

module.exports = {
    createTurn : function()
    {
        return new oneTurn();
    }
}
