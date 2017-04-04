var oneCard = function(object, type)
{
    this.object = object;
    this.type = type;
    this.handler = null;
    this.phaserObject = null;
    this.isDragged = false;
    this.overLappedCase = null;
}

oneCard.prototype = {
    setHandler : function(handler)
    {
        this.handler = handler;
    },
    enableDrag : function(dragSquadFunc, stopDragSquadFunc, context)
    {
        this.phaserObject.inputEnabled = true;
        this.game.physics.arcade.enable(this.phaserObject);
        this.phaserObject.input.enableDrag();
        this.phaserObject.events.onDragStart.add(dragSquadFunc, context);
        this.phaserObject.events.onDragStop.add(stopDragSquadFunc, context);
    },
    disableDrag : function()
    {
        if(this.phaserObject.input != null)
        {
            this.phaserObject.input.disableDrag();
        }
    },
    drawCard : function()
    {
        if(this.handler !== null)
        {
            if(this.type != null && this.object != null)
            {
                if(this.type == "order")
                {
                    this.drawCardOrder();
                }   
                else if(this.type == "squad")
                {
                    this.drawCardSquad();
                }
            }
            else
            {
                this.drawCardNeutral();
            }
        }
    },
    drawCardOrder : function()
    {
        let oneCard = this.game.add.sprite(this.handler.x, this.handler.y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(this.handler.width / oneCard.width, this.handler.height / oneCard.height);
        oneCard.ref = this;
        this.phaserObject = oneCard;
        var style = { font: "35px Arial",fill: "#ff0044"/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.game.add.text(0, 0, this.object.name , style);
        text.anchor.set(0 , 0);
        oneCard.addChild(text);
    },
    drawCardSquad : function()
    {
        let oneCard = this.game.add.sprite(this.handler.x, this.handler.y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(this.handler.width / oneCard.width, this.handler.height / oneCard.height);
        oneCard.ref = this;
        this.phaserObject = oneCard;
        let oneSquad = this.game.add.sprite(0, 0, 'squad');
        oneSquad.anchor.x = 0.5;
        oneSquad.anchor.y = 0.5;
        oneCard.addChild(oneSquad);
    },
    drawCardNeutral : function()
    {
        let oneCard = this.game.add.sprite(this.handler.x, this.handler.y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(this.handler.width / oneCard.width, this.handler.height / oneCard.height);
        oneCard.ref = this;
        this.phaserObject = oneCard;
    },
    destroy : function()
    {
        this.handler.card = null;
        this.handler = null;
        this.phaserObject.destroy();
        this.phaserObject = null;
        this.object = null;
    }
}

function createCard(game, object, type)
{
    var card = new oneCard(object, type);
    card.game = game;
    return card;
}
