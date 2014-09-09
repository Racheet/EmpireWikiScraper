#!/usr/local/bin/node

var prompt = require("prompt"),
    fs = require("fs"),
    async = require("async");


var inputPath = process.argv[2] || __dirname + "/input/data.json";
var data = JSON.parse(fs.readFileSync(inputPath)
    .toString());
var nations = JSON.parse(fs.readFileSync(__dirname + "/static/nations.json"));

prompt.start();


function getTerritoryData(territory, callback) {
    //setup
    function matchTerritoryToNation(territory) {
        territory.nation = findNationOf(territory.name);
    }

    function checkIfNationIsCorrect(callback) {
        var schema = {
            name: "nation",
            message: "Is " + territory.name + " in " + territory.nation + "?" + "(yes/no)",
            validator: /^[yY]$|^[yY]es$|^[nN]$|^[nN]o$/,
            warning: 'Please respond yes or no'

        };

        prompt.get(schema, function (err, result) {
            if(err) return callback(err);
            if(result.nation.toLowerCase()
                .match(/^[yY]$|^[yY]es$/)) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }

    function manuallyUpdateNation(callback) {
        
        console.log("crumbs!");
        callback();
    }

    //logic
    console.log("This Territory is:", territory.name);
    matchTerritoryToNation(territory);

    checkIfNationIsCorrect(function (nationIsCorrect) {
        if(nationIsCorrect) {
            return callback(null, territory);
        } else {
            manuallyUpdateNation(function () {
                return callback(null, territory);
            });
        }
    });

}


function writeOutProvincesJson(err, provinces) {
    if(err) return console.error(err);

    var output = fs.createWriteStream(__dirname + "/output/data.json", {
        "flags": "w",
        "encoding": "utf8"
    });

    output.end(provinces, "utf8", function () {
        console.log("log: output file written");
    });
}


function findNationOf(territory) {
    var name = null;
    nations.forEach(function (nation) {
        if(nation.territories.indexOf(territory) != -1) {
            name = nation.name;
        }
    });
    return name;
}


async.mapSeries(data, getTerritoryData, function (err, results) {
    if(err) throw new Error(err);
    writeOutProvincesJson(null, JSON.stringify(results));
});