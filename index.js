var fs = require("fs"),
    browser = require("libs/browser"),
    crawlPage = require("libs/crawlPage"),
    crawlProvincePage = require("libs/crawlProvincePage"),
    async = require("async");


var output = fs.createWriteStream("output/data.json", {
    "flags": "w",
    "encoding": "utf8"
});

var data = [],
    pagesToCrawl = [],
    concurrentWorkers = 1,
    gazetteerUrl = "http://www.profounddecisions.co.uk/empire-wiki/Gazetteer";
    
browser.on("readyToCrawl", function(){ 
    
           crawlPage(gazetteerUrl, 
             function() {
               var $provinces = $("#article .span4 ul li a") // select all the province nodes
               $provinces = $provinces.map(function() {
                   return this.href;
               }) // load just their hrefs
               return $provinces.get(); // convert to a basic array from a jquery array
           },function(result) {
               pagesToCrawl = result;
               browser.emit("pagesToCrawlPopulated");
               console.log("log: Page Closed");
               console.log(pagesToCrawl);
           });
    
});


browser.on("pagesToCrawlPopulated", function() {
    async.mapLimit(pagesToCrawl,concurrentWorkers,crawlProvincePage,function(err,results){
        console.log("Final Callback Called");
        if (err) throw err;
        browser.pageCreator.exit();
        console.log("log: PhantomJS Closed");
        data = results;
        data = JSON.stringify(data);
        console.log("log: Built Data Array");
                    output.end(data,"utf8", function() {console.log("log: output file written")});
    });
});