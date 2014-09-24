var fs = require("fs"),
    configs = require("loadConfigs.js"),
    askUser = require("promptUserViaTerminal.js"),
    async = require("async");


var data = configs.inputData,
    inputArgument = process.argv[2] || 11, //default to Reikos, it has White Granite
    province = data[inputArgument],
    features = province.features,
    regions = province.regions;


function lookForWhiteGraniteIn(feature) {
    var foundGranite = false,
        graniteQuantity = null;
    if (feature.description.match(/\d+.*wains of.* white granite/i)) {
        foundGranite = true;
    }
    if (foundGranite) {
        graniteQuantity = feature.description.match(/(\d+).* wains of.*white granite/i)[1];
        return graniteQuantity;
    }
    return false;
    
}

function lookForWeirwoodIn(feature) {
    var foundWeirwood = false,
        weirwoodQuantity = null;
    if (feature.description.match(/\d+.*wains of/) && feature.description.match(/weirwood/i)) {
        foundWeirwood = true;
    }
    if (foundWeirwood) {
        weirwoodQuantity = feature.description.match(/(\d+).* wains of.*weirwood/i)[1];
        return weirwoodQuantity;
    }
    return false;
    
}

function lookForMithrilIn(feature) {
    var foundMithril = false,
        mithrilQuantity = null;
    if (feature.description.match(/\d+.* wains of/) && feature.description.match(/mithril/i)) {
        foundMithril = true;
    }
    if (foundMithril) {
        mithrilQuantity = feature.description.match(/(\d+).* wains of.*mithril/i)[1];
        return mithrilQuantity;
    }
    return false;
    
}

function lookForIliumIn(feature) {
    var foundilium = false,
        iliumQuantity = null;
    if (feature.description.match(/rings? of/) && feature.description.match(/ilium/i)) {
        foundilium = true;
    }
    if (foundilium) {
        return foundilium;
    }
    return false;
}

function summariseProvince(province) {
    province.whiteGranite = 0;
    province.mithril = 0;
    province.weirwood = 0;
    province.ilium = false;
    
    province.features.forEach(function(feature){
        if (feature.whiteGranite) province.whiteGranite += parseInt(feature.whiteGranite,10);
        if (feature.mithril) province.mithril += parseInt(feature.mithril,10);
        if (feature.weirwood) province.weirwood += parseInt(feature.weirwood,10);
        if (feature.ilium) province.ilium = true;
    });
}


function parseFeature(feature) {
    var granite = 0,
        mithril = 0,
        weirwood = 0,
        ilium = false;
        
    console.log("Processing",feature.name);
    granite =  lookForWhiteGraniteIn(feature);
    mithril = lookForMithrilIn(feature);
    weirwood = lookForWeirwoodIn(feature);
    ilium = lookForIliumIn(feature);
    
    if (granite) feature.whiteGranite = granite;
    if (mithril) feature.mithril = mithril;
    if (weirwood) feature.weirwood = weirwood;
    if (ilium) feature.ilium = "ilium found";
    
}



features.forEach(parseFeature);
regions.forEach(parseFeature);

summariseProvince(province);
if (province.weirwood) console.log(province.weirwood.toString(),"wains of weirwood found");
if (province.mithril) console.log(province.mithril.toString(),"wains of mithril found");
if (province.whiteGranite) console.log(province.whiteGranite.toString(),"wains of white granite found");
if (province.ilium) console.log("Ilium Found");
