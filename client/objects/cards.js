var oneCard = function(object, type)
{
    this.object = object;
    this.type = type;
    this.phaserObject = null;
    this.isDragged = false;
    this.overlapedCase = null;
    this.width = 100;
    this.height = 100;
    this.player = null;
    this.x = null;
    this.y = null;
    this.angle = null;
}

oneCard.prototype = {
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
    isNeutral : function()
    {
        if(this.type != null && this.object != null)
        {
            return false;
        }
        else
        {
            return true;
        }
    },
    drawCardCaptain : function()
    {
        
    },
    drawCard : function()
    {
        if(this.phaserObject == null)
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
                else if(this.type == "captain")
                {
                    this.drawCardCaptain();
                }
            }
            else
            {
                this.drawCardNeutral();
            }
        }
        else
        {
            this.phaserObject.x = this.x;
            this.phaserObject.y = this.y;
        }
    },
    drawCardOrder : function()
    {
        let oneCard = this.game.add.sprite(this.x, this.y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(this.width / oneCard.width, this.height / oneCard.height);
        oneCard.ref = this;
        this.phaserObject = oneCard;
        var style = { font: "35px Arial",fill: "#ff0044"/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.game.add.text(0, 0, this.object.name , style);
        text.anchor.set(0 , 0);
        oneCard.addChild(text);
    },
    drawCardSquad : function()
    {
        let oneCard = this.game.add.sprite(this.x, this.y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(this.width / oneCard.width, this.height / oneCard.height);
        oneCard.ref = this;
        this.phaserObject = oneCard;
        let oneSquad = this.game.add.sprite(0, 0, 'squad');
        oneSquad.anchor.x = 0.5;
        oneSquad.anchor.y = 0.5;
        oneCard.addChild(oneSquad);
    },
    drawCardNeutral : function(x, y)
    {
        let oneCard = this.game.add.sprite(this.x, this.y, 'card');
        oneCard.anchor.x = 0.5;
        oneCard.anchor.y = 0.5;
        oneCard.scale.setTo(this.width / oneCard.width, this.height / oneCard.height);
        oneCard.ref = this;
        this.phaserObject = oneCard;
    },
    destroy : function()
    {
        console.log('la');
        this.phaserObject.destroy();
        this.phaserObject = null;
        this.object = null;
    }
}

