var prompt = require("prompt"),
    Q = require("q"),
    configs = require("./loadConfigs.js"),
    getTerritoryNation = require("./getTerritoryNation.js"),
    getTerritoryResources = require("./parseFeatureOrProvince.js");

var nations = configs.nationsArray;
var nationsRegex = configs.nationsRegex;

function getTerritoryData(territory, callback) {

    console.log("This Territory is:", territory.name);
    getTerritoryNation(territory).then(getTerritoryResources).nodeify(callback);
}



module.exports = getTerritoryData;