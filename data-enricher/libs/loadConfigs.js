var fs = require("fs");

var nationsArray = JSON.parse(fs.readFileSync(__dirname +"/../static/nations.json").toString());
var nationsRegex = /^[Hh]ighguard$|^[Tt]he [Mm]arches|[Dd]awn$|^[Tt]he [Ll]eague$|^[Vv]arushka$|^[Tt]he [Bb]rass Coast$|^[Uu]rizen$|^[Ww]intermark$|^[Nn]avarr$|^[Ii]mperial [Oo]rcs$/;

var inputData = "No Crawled Data Available";

if (fs.existsSync(__dirname + "/../../output/data.json")) {
    inputData = JSON.parse(fs.readFileSync(__dirname + "/../../output/data.json").toString());
} else {
    console.log("nothing found at", __dirname + "/../../output/data.json");
}

module.exports = {
    "nationsArray" : nationsArray,
    "nationsRegex" : nationsRegex,
    "inputData" : inputData
};