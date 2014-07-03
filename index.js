var fs = require("fs"),
    browser = require("libs/browser"),
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
    


browser.crawlPage(gazetteerUrl, function() {
   //This function is run within the phantomJS context on the gazeteer homepage
   var $provinces = $("#article .span4 ul li a"); // select all the province nodes
   $provinces = $provinces.map(function() {
       return this.href;
   }); // load just their hrefs
   return $provinces.get(); // convert to a basic array from a jquery array
}, function(result) {
   //This function is run in the node context and recieves the return value of the previous function
   pagesToCrawl = result;
   browser.emit("pagesToCrawlPopulated");
   console.log(pagesToCrawl);
});



browser.on("pagesToCrawlPopulated", function() {
   async.mapLimit(pagesToCrawl, concurrentWorkers, crawlProvincePage, function(err, results) {
       if(err) throw err;
       browser.exit();
       console.log("log: PhantomJS Closed");
       data = results;
       data = JSON.stringify(data);
       console.log("log: Built Data Array");
       output.end(data, "utf8", function() {
           console.log("log: output file written");
       });
   });
});