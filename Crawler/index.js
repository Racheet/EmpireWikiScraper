var fs = require("fs"),
    browser = require("libs/browser"),
    crawlProvincePage = require("libs/crawlProvincePage"),
    async = require("async"),
	serialiseObject = require("js-object-pretty-print").pretty;


var concurrentWorkers = 1,
    gazetteerUrl = "http://www.profounddecisions.co.uk/empire-wiki/Gazetteer";


function crawlGazeteerHomepage (done) {
    browser.crawlPage(gazetteerUrl, function() {
       //This function is run within the phantomJS context on the gazeteer homepage
       var $provinces = $("#article .span4 ul li a"); 
       $provinces = $provinces.map(function() {
           return this.href;
       }); 
       return $provinces.get(); 
    }, function(result) {
       //This function is run in the node context and recieves the return value of the previous function
       pagesToCrawl = result;
       browser.emit("pagesToCrawlPopulated");
       console.log(pagesToCrawl);
       done(null, pagesToCrawl);
    });
    
}

function serialiseObjectToJson (data) {
    var defaultSpacing = 4,
        outputFormat = "JSON"; //can be JSON, PRINT or HTML
        
    return serialiseObject(data,defaultSpacing,outputFormat);
}

function crawlAllProvinces (pagesToCrawl,done) {
   async.mapLimit(pagesToCrawl, concurrentWorkers, crawlProvincePage, function(err, results) {
       if(err) throw err;
       var data = [];
       browser.exit();
       console.log("log: PhantomJS Closed");
       data = results;
       data = serialiseObjectToJson(data);
       done(null,data);
   });
}

function writeOutProvincesJson (err, provinces) {
    if (err) return console.error(err);
    
    var output = fs.createWriteStream("output/data.json", {
        "flags": "w",
        "encoding": "utf8"
    });
    
    output.end(provinces, "utf8", function() {
       console.log("log: output file written");
   });
}

async.waterfall([crawlGazeteerHomepage,crawlAllProvinces],writeOutProvincesJson);

