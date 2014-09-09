var fs = require("fs");

var nationsArray = JSON.parse(fs.readFileSync(__dirname +"/../static/nations.json").toString());
var nationsRegex = /^[Hh]ighguard$|^[Tt]he [Mm]arches|[Dd]awn$|^[Tt]he [Ll]eague$|^[Vv]arushka$|^[Tt]he [Bb]rass Coast$|^[Uu]rizen$|^[Ww]intermark$|^[Nn]avarr$|^[Ii]mperial [Oo]rcs$/;

var inputData = JSON.parse(fs.readFileSync(__dirname + "/../input/data.json").toString());

module.exports = {
    "nationsArray" : nationsArray,
    "nationsRegex" : nationsRegex,
    "inputData" : inputData
};