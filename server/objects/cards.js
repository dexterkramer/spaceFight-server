
var oneCard = function(object, type)
{
    this.object = object;
    this.type = type;
    this.isDragged = false;
    this.currentCardIndex = null;
}

oneCard.prototype = {
    destroy : function()
    {
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
                cardInfos.object = this.object.createSquadInfos(mask.object.squad);
            }
            else if(this.type == "captain")
            {
                cardInfos.object = this.object.createCaptainInfos(mask.object.captain);
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