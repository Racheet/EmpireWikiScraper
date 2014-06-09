var fs = require("fs"),
    Browser = require("libs/browser.js");


var output = fs.createWriteStream("output/data.json", {
    "flags": "w",
    "encoding": "utf8"
});

var data = {},
    pagesToCrawl = [];

function crawlPage (browser,page,url,payload) {
    "use strict";
    if(typeof url != "string") {throw "url needs to be a string"; }
    if(url.match(/^https*:\/\//) === null) {throw "second argument needs to be a url"; }
    
    page.open(url, function(status) {
        if(status !== "success") throw status;
        console.log("Opened Page:",url);
        
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function (result) {
            
            page.evaluate(
                payload,
                function (result) {
                    //Do something with the result of the payload
                    console.log("log: data recieved from PhantomJS")
                    console.log(result)
                    page.close();
                    browser.emit("pageClosed")
                    console.log("log: Page Closed")
            });
            
        });
    })
};

var browser = new Browser();

browser.on("readyToCrawl", function () {
    browser.pageCreator.createPage(function(page) {
        crawlPage(browser,page,"https://pisaca-jelick.codio.io/Provinces/Gazetteer.htm",function() {
             var $provinces = $("#article .span4 ul li a") // select all the province nodes
                 $provinces = $provinces.map(function() {return this.href;}) // load just their hrefs
                 
             return $provinces.get(); // convert to a basic array from a jquery array
            
            
            
        });
    });
});

browser.on("pageClosed", function () {
    browser.pageCreator.exit();
    console.log("log: PhantomJS closed");
});

console.log("Log: Event Handler Attached");