var Q = require("q"),
    askUser = require("./promptUserViaTerminal.js"),
    configs = require("./loadConfigs.js");

var nations = configs.nationsArray;
var nationsRegex = configs.nationsRegex;

function getNationOfTerritory(territory) {
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
        var schema = {
            name: "nation",
            message: "Is " + territory.name + " in " + territory.nation + "?" + "(yes/no)",
            validator: /^[yY]$|^[yY]es$|^[nN]$|^[nN]o$/,
            warning: 'Please respond yes or no'

        };

        function processResponse(result) {
            var deferred = Q.defer();
            if(result.nation.toLowerCase()
                .match(/^[yY]$|^[yY]es$/)) {
                deferred.resolve(territory);
                return deferred.promise;
            } else {
                return updateIncorrectNation(territory);
            }
        }
        return askUser(schema).then(processResponse);

    }

    function updateIncorrectNation(territory) {
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

        function processResponse(result) {
            territory.nation = toTitleCase(result.nation);

            return territory;

        }
        
        return askUser(schema).then(processResponse);
    }


    //logic
    return matchTerritoryToNation(territory).then(confirmNationIsCorrect);
}


module.exports = getNationOfTerritory;