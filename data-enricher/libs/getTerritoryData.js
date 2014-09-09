var prompt = require("prompt"),
    Q = require("q"),
    configs = require("./loadConfigs.js");

var nations = configs.nationsArray;
var nationsRegex = configs.nationsRegex;

prompt.start();

function getTerritoryData(territory, callback) {
    //setup
    function matchTerritoryToNation(territory) {
        var deferred = Q.defer();
        territory.nation = findNationOf(territory.name);
        deferred.resolve(territory);
        return deferred.promise;
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
                updateIncorrectNation(territory, deferred.resolve);
            }
        });

        return deferred.promise;
    }

    function updateIncorrectNation(territory, callback) {
        var schema = {
            "name": "nation",
            "message": "Which Nation is " + territory.name + " actually in?",
            "validator": nationsRegex,
            "warning": "Please Enter One of: Highguard, The League, The Brass Coast, Varushka, Navarr, Dawn, Wintermark, Urizen, The Marches or Imperial Orcs"
        };

        function toTitleCase(str) {
            return str.replace(/\b\w/g, function (txt) {
                return txt.toUpperCase();
            });
        }


        prompt.get(schema, function (err, result) {
            if(err) return callback(err);
            territory.nation = toTitleCase(result.nation);

            callback(territory);

        });
    }


    //logic
    console.log("This Territory is:", territory.name);
    matchTerritoryToNation(territory)
        .then(confirmNationIsCorrect)
        .nodeify(callback);
}


module.exports = getTerritoryData;