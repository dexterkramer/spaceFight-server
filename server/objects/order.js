var oneOrder = function(name, effects)
{
    this.name = name;
    this.effects = effects;
};

oneOrder.prototype = {
    createOrderInfos : function()
    {
        var orderInfos = {};
        orderInfos.name = this.name;
        orderInfos.effects = this.effects;
        return orderInfos;
    }
};

module.exports = {
    createOrders : function(player, ordersJson)
    {
        var orderArray = [];
        var ref = this;
        ordersJson.forEach(function(order){
            orderArray.push(ref.createOrder(order));
        });
        return orderArray;
    },

    createOrder : function(orderJson)
    {
        var orderObject = new oneOrder(orderJson.name, orderJson.effects);
        return orderObject;
    }
}
