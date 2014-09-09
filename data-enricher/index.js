#!/usr/local/bin/node

var getTerritoryData = require("./libs/getTerritoryData.js"),
    async = require("async"),
	configs = require("./libs/loadConfigs.js"),
    output = require("./libs/writeOutput.js");


var data = configs.inputData;
var nations = configs.nationsArray;
var nationsRegex = configs.nationsRegex;

async.mapSeries(data, getTerritoryData, function (err, results) {
    if(err) throw new Error(err);
    output(null, JSON.stringify(results),__dirname + "/output/data.json");
});