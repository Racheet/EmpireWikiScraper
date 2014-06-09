var phantom = require("phantom"),
    fs = require("fs"),
    EventEmitter = require("events").EventEmitter,
    util = require("util");

var output = fs.createWriteStream("output/data.json", {
    "flags": "w",
    "encoding": "utf8"
});

var data = {};
var Browser = function() {
    "use strict";
    var self = this;
    EventEmitter.call(this);
    
    this.createPage = function () {};
    
    phantom.create(function (instance) {
        self.pageCreator = instance;
        self.createPage = instance.createPage;
        self.emit("readyToCrawl");
        console.log("Log: Event Fired");
    });   
    
    return this;
};

util.inherits(Browser,EventEmitter);

function crawlPage (browser,page,url) {
    "use strict";
    if(typeof url != "string") {throw "url needs to be a string"; }
    if(url.match(/^https*:\/\//) === null) {throw "second argument needs to be a url"; }
    
    page.open(url, function(status) {
        if(status !== "success") throw status;
        console.log("Opened Page:",url);
        
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function (result) {
            
            page.evaluate(
               function(){
                    //payload goes here
                    return "payload";
                
            }, function (result) {
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
        crawlPage(browser,page,"https://pisaca-jelick.codio.io/Provinces/Gazetteer.htm");
    });
});

browser.on("pageClosed", function () {
    browser.pageCreator.exit();
    console.log("log: PhantomJS closed");
});

console.log("Log: Event Handler Attached");
