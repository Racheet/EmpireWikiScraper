#!/usr/bin/node

var getTerritoryData = require("./libs/getTerritoryData.js"),
    async = require("async"),
	configs = require("./libs/loadConfigs.js"),
    output = require("./libs/writeOutput.js"),
    fs = require("fs");


var data = configs.inputData;
var nations = configs.nationsArray;
var nationsRegex = configs.nationsRegex;
var outputDirectory = __dirname + "/../output/";

if (configs.inputData === "No Crawled Data Available") {
    console.log("Info: No Old Crawl Data Found");
}

function enrichData () {
    async.mapSeries(data, getTerritoryData, function (err, results) {
        if(err) throw new Error(err);
        
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }
        
        output(results,outputDirectory+"provinces.json",process.exit);
    });
}

module.exports = enrichData;