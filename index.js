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

browser.on("pageClosed", function () {
    //browser.pageCreator.exit();
    //console.log("log: PhantomJS closed");
});

console.log("Log: Event Handler Attached");

browser.on("pagesToCrawlPopulated",function crawlProvincePage (){
    var thisProvince = pagesToCrawl[0]
    browser.pageCreator.createPage(function(page){
        
        crawlPage(browser,page,thisProvince,function() {
            var output = {};
            output.name = $("title").html().split("-")[0];
            output.history = $("#Recent_History:parent ~ p").html();
            output.overview = $("#Overview:parent + p").html();
            
            return JSON.stringify(output);
        }, function (result) {
            thisProvince = result;
            page.close();
            console.log(pagesToCrawl);
        });
        
    });
    
});
