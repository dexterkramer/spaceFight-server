var playerMask = require("./../infosMasks/playerInfosMask.js");

var oneCard = function(object, type)
{
    this.object = object;
    this.type = type;
    this.handler = null;
    this.isDragged = false;
    this.currentCardIndex = null;
}

oneCard.prototype = {
    setHandler : function(handler)
    {
        this.handler = handler;
    },
    drawCard : function()
    {
        if(this.handler !== null)
        {
            if(this.type == "order")
            {
                //drawCardOrder(this, this.handler.x, this.handler.y);
                //enableDragCard(this, dragCard, stopDragCard);
            }   
            else if(this.type == "squad")
            {
                //drawCardSquad(this, this.handler.x, this.handler.y);
                //enableDragCard(this, dragCard, stopDragCard);
            }
        }
    },
    destroy : function()
    {
        this.handler.card = null;
        this.handler = null;
        this.object = null;
        this.type = null;
    },
    createCardInfos : function(mask)
    {
        var cardInfos = {};
        if(mask.type)
        {
            cardInfos.type = this.type;
        }
        else
        {
            cardInfos.type = null;
        }
        if(mask.object)
        {
            if(this.type == "order")
            {
                cardInfos.object = this.object.createOrderInfos();
            }   
            else if(this.type == "squad")
            {
                cardInfos.object = this.object.createSquadInfos(playerMask.fleat.deployedSquad);
            }
        }
        else
        {
            cardInfos.object = null;
        }
        cardInfos.currentCardIndex = this.currentCardIndex;
        return cardInfos;
    }
}

module.exports = {
    createCard : function(object, type)
    {
        return new oneCard(object, type);
    }
}