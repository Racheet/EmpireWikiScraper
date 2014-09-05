#!/usr/local/bin/node
var prompt = require("prompt"),
    fs = require("fs"),
    async = require("async");


var inputPath = process.argv[2] || __dirname + "/input/data.json";


var data = JSON.parse(fs.readFileSync(inputPath).toString());

prompt.start();


function getTerritoryData(territory, callback) {

    var schema = {
        "nation": {
            "nation": "What Nation does this territory belong to?",
            "type": "string",
            "required": true
        }
    };
    
    console.log("This Territory is:",territory.name);
    prompt.get(["nation"], function (err, result) {
        if(err) return callback(err);
        territory.nation = result.nation;
        if (callback) return callback(null, territory);
    });
}

function writeOutProvincesJson (err, provinces) {
    if (err) return console.error(err);
    
    var output = fs.createWriteStream(__dirname + "/output/data.json", {
        "flags": "w",
        "encoding": "utf8"
    });
    
    output.end(provinces, "utf8", function() {
       console.log("log: output file written");
   });
}

async.mapSeries(data,getTerritoryData,function(err,results){
    if (err) throw new Error(err);
    writeOutProvincesJson(null,JSON.stringify(results));
});