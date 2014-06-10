var fs = require("fs"),
    Browser = require("libs/browser"),
    crawlPage = require("libs/crawlPage"),
    async = require("async");


var output = fs.createWriteStream("output/data.json", {
    "flags": "w",
    "encoding": "utf8"
});

var data = {},
    pagesToCrawl = [];


var browser = new Browser();

browser.on("readyToCrawl", function crawlHostPage () {
    browser.pageCreator.createPage(function(page) {
        
        crawlPage(browser,page,"https://pisaca-jelick.codio.io/Provinces/Gazetteer.htm",function() {
             var $provinces = $("#article .span4 ul li a") // select all the province nodes
                 $provinces = $provinces.map(function() {return this.href;}) // load just their hrefs
                 
             return $provinces.get(); // convert to a basic array from a jquery array
            
            
        }, function (result) {
            pagesToCrawl = result;
            page.close();
            browser.emit("pageClosed");
            browser.emit("pagesToCrawlPopulated");
            console.log("log: Page Closed");
            console.log(pagesToCrawl);
            
        });
    });
});

console.log("Log: Event Handler Attached");

function crawlProvincePage (thisProvince,callback){
    thisProvince = thisProvince || pagesToCrawl[0];
    browser.pageCreator.createPage(function(page){
        
        crawlPage(browser,page,thisProvince,function() {
            //Note to self, this function is injected into the page, and currently doesn't work
            var output = {};
            output.name = $("title").text().trim().split(" - ")[0];
            output.history = $("#Recent_History").parent().nextUntil("h2,h3").text();
            output.overview = $("#Overview").parent().nextUntil("h2,h3").text()
            
            return JSON.stringify(output);
        }, function (result) {
            thisProvince = JSON.parse(result);
            console.log("Parsed:",thisProvince.name);
            page.close();
            if (typeof callback === "function") { callback(null,thisProvince); }
        });
        
    });
};

browser.on("pagesToCrawlPopulated", function() {
    async.mapLimit(pagesToCrawl,5,crawlProvincePage,function(err,results){
        if (err) throw err;
        pagesToCrawl = results;
        console.log("Completed Array:",pagesToCrawl);
        browser.pageCreator.exit();
        console.log("log: PhantomJS Closed");
    });
});