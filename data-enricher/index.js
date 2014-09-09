#!/usr/local/bin/node

var prompt = require("prompt"),
    fs = require("fs"),
    async = require("async"),
    Q = require("q");


var inputPath = process.argv[2] || __dirname + "/input/data.json";
var data = JSON.parse(fs.readFileSync(inputPath)
    .toString());
var nations = JSON.parse(fs.readFileSync(__dirname + "/static/nations.json"));

prompt.start();


function getTerritoryData(territory, callback) {
    //setup
    function matchTerritoryToNation(territory) {
        var deferred = Q.defer();
        territory.nation = findNationOf(territory.name);
        deferred.resolve(territory);
        return deferred.promise;
    }

    function confirmNationIsCorrect(territory) {
        var deferred = Q.defer();
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
                deferred.resolve(territory);
            } else {
                updateIncorrectNation(territory,deferred.resolve);
            }
        });
        
        return deferred.promise;
    }
    
    function updateIncorrectNation(territory,callback){
        var schema = {
            "name" : "nation",
            "message" : "Which Nation is " + territory.name + " actually in?"
        };
        
         
        prompt.get(schema, function(err,result){
           if (err) return callback(err);
           territory.nation = result.nation;
            
           callback(territory);
            
        });
    }


    //logic
    console.log("This Territory is:", territory.name);
    matchTerritoryToNation(territory).then(confirmNationIsCorrect).nodeify(callback);
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