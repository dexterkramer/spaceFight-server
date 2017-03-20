var action = function(type, target){
    this.type = type;
    this.target = target;
};

action.prototype = {
    createActionInfos : function()
    {
        var actionInfos = {};
        actionInfos.target = this.target.createSquadInfos();
        actionInfos.type = this.type;
        return actionInfos;
    }
};

module.exports = action;