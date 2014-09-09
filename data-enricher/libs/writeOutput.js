var fs = require("fs");

function writeOutProvincesJson(err, provinces,destination) {
    if(err) return console.error(err);

    var output = fs.createWriteStream(destination, {
        "flags": "w",
        "encoding": "utf8"
    });

    output.end(provinces, "utf8", function () {
        console.log("log: output file written");
    });
}

module.exports = writeOutProvincesJson;