var fs = require("fs"),
    askUser = require("./promptUserViaTerminal.js"),
    async = require("async");


function lookForWhiteGraniteIn(feature) {
    var foundGranite = false,
        graniteQuantity = null;
    if (feature.description.match(/\d+ (imperial )?wains of.* white granite/i)) {
        foundGranite = true;
    }
    if (foundGranite) {
        graniteQuantity = feature.description.match(/(\d+) (imperial )?wains of.*white granite/i)[1];
        return graniteQuantity;
    }
    return false;
    
}

function lookForWeirwoodIn(feature) {
    var foundWeirwood = false,
        weirwoodQuantity = null;
    if (feature.description.match(/\d+ (imperial )?wains of/i) && feature.description.match(/weirwood/i)) {
        foundWeirwood = true;
    }
    if (foundWeirwood) {
        weirwoodQuantity = feature.description.match(/(\d+) (imperial )?wains of.*weirwood/i)[1];
        return weirwoodQuantity;
    }
    return false;
    
}

function lookForMithrilIn(feature) {
    var foundMithril = false,
        mithrilQuantity = null;
    if (feature.description.match(/\d+ (imperial )?wains of/i) && feature.description.match(/mithril/i)) {
        foundMithril = true;
    }
    if (foundMithril) {
        mithrilQuantity = feature.description.match(/(\d+) (imperial )?wains of.*mithril/i)[1];
        return mithrilQuantity;
    }
    return false;
    
}

function lookForIliumIn(feature) {
    var foundilium = false,
        iliumQuantity = null;
    if (feature.description.match(/rings? of/i) && feature.description.match(/ilium/i)) {
        foundilium = true;
    }
    if (foundilium) {
        return foundilium;
    }
    return false;
}

function summariseTerritory(territory) {
    territory.whiteGranite = 0;
    territory.mithril = 0;
    territory.weirwood = 0;
    territory.ilium = false;
    
    territory.features.forEach(function(feature){
        if (feature.whiteGranite) territory.whiteGranite += parseInt(feature.whiteGranite,10);
        if (feature.mithril) territory.mithril += parseInt(feature.mithril,10);
        if (feature.weirwood) territory.weirwood += parseInt(feature.weirwood,10);
        if (feature.ilium) territory.ilium = true;
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


function processTerritory(territory) {
    territory.features.forEach(parseFeature);
    territory.regions.forEach(parseFeature);

    summariseTerritory(territory);
    if (territory.weirwood) console.log(territory.weirwood.toString(),"wains of weirwood found");
    if (territory.mithril) console.log(territory.mithril.toString(),"wains of mithril found");
    if (territory.whiteGranite) console.log(territory.whiteGranite.toString(),"wains of white granite found");
    if (territory.ilium) console.log("Ilium Found");
    
    return territory;
}

module.exports = processTerritory;