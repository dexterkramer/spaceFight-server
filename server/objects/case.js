var oneCase = function(name,number,width,height){
    this.position = {};
    this.position.x = null;
    this.position.y = null;
    this.number = number;
    this.name = name;
    this.squad = null;
    this.left = null;
    this.right = null;
    this.top = null;
    this.bottom = null;
    this.height = height;
    this.width = width;
    this.phaserObject = null;
    this.overLapped = null;
};

oneCase.prototype = {

}

module.exports = {
    createCases : function(casemap)
    {
        var caseByLine = 4;
        var lines = 4;
        var caseTable = [];
        casemap.forEach(function(elem){
            let newCase = new oneCase(elem.name, elem.number, elem.height, elem.width);
            caseTable[elem.number] = newCase;
        });

        casemap.forEach(function(elem){
            caseTable[elem.number].left = (elem.links.left !== null) ? caseTable[elem.links.left] : null;
            caseTable[elem.number].right = (elem.links.right !== null) ? caseTable[elem.links.right] : null;
            caseTable[elem.number].topLeft = (elem.links.topLeft !== null) ? caseTable[elem.links.topLeft] : null;
            caseTable[elem.number].topRight = (elem.links.topRight !== null) ? caseTable[elem.links.topRight] : null;
            caseTable[elem.number].bottomLeft = (elem.links.bottomLeft !== null) ? caseTable[elem.links.bottomLeft] : null;
            caseTable[elem.number].bottomRight = (elem.links.bottomRight !== null) ? caseTable[elem.links.bottomRight] : null;
        });

        return caseTable;
    }
}
