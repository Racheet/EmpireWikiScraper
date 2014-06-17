var fs = require("fs"),
    browser = require("libs/browser"),
    crawlPage = require("libs/crawlPage"),
    async = require("async");


var output = fs.createWriteStream("output/data.json", {
    "flags": "w",
    "encoding": "utf8"
});

var data = [],
    pagesToCrawl = [];
    
browser.on("readyToCrawl", function crawlHostPage () {
        
       crawlPage("https://pisaca-jelick.codio.io/Provinces/Gazetteer.htm",function() {
             var $provinces = $("#article .span4 ul li a") // select all the province nodes
                 $provinces = $provinces.map(function() {return this.href;}) // load just their hrefs
                 
             return $provinces.get(); // convert to a basic array from a jquery array
            
            
       }, function (result) {
            pagesToCrawl = result;
            browser.emit("pagesToCrawlPopulated");
            console.log("log: Page Closed");
            console.log(pagesToCrawl);
            
        });
});

console.log("Log: Event Handler Attached");

function crawlProvincePage (thisProvince,callback){
    thisProvince = thisProvince || pagesToCrawl[0];
        
        crawlPage(thisProvince,function() {
            var output = {},
                majorFeatures = [];
                
            
            output.name = $("title").text().trim().split(" - ")[0];
            output.history = $("#Recent_History").parent().nextUntil("h2,h3").text();
            output.overview = $("#Overview").parent().nextUntil("h2,h3").text();
            output.features = $("#Major_Features").parent().nextUntil("h2").filter("h3").map(function() {
                return {"name": $(this).text(), "description": $(this).nextUntil("h2,h3").text() } 
            }).get() ;
            
            
            
            return JSON.stringify(output);
        }, function (result) {
            thisProvince = JSON.parse(result);
            console.log("Parsed:",thisProvince.name);
            if (typeof callback === "function") { callback(null,thisProvince); }
        });
        
};

browser.on("pagesToCrawlPopulated", function() {
    async.mapLimit(pagesToCrawl,1,crawlProvincePage,function(err,results){
        console.log("Final Callback Called");
        if (err) throw err;
        browser.pageCreator.exit();
        console.log("log: PhantomJS Closed");
        data = results;
        console.log("log: Built Data Array");
                    output.end(JSON.stringify(data),"utf8", function() {console.log("log: output file written")});
    });
});