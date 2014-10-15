var fs = require("fs");

function writeOutProvincesJson(provinces,destination,callback) {
    
    
    
    var output = fs.createWriteStream(destination, {
        "flags": "w",
        "encoding": "utf8"
    });
    
    provinces = serialise(provinces);

    output.end(provinces, "utf8", function () {
        console.log("log: output file written");
        if (callback) callback();
    });
}


function serialise(JSobject) {
    var defaultSpacing = 2;                   
    return JSON.stringify(JSobject,null,defaultSpacing);
}



module.exports = writeOutProvincesJson;