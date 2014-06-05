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
    var self = this;
    EventEmitter.call(this);
    
    this.createPage = function () {};
    
    phantom.create(function (instance) {
        self.pageCreator = instance;
        self.createPage = instance.createPage;
        self.emit("readyToCrawl");
        console.log("Log: Event Fired");
    });   
    
    this.emit("init");
    
    return this;
};

util.inherits(Browser,EventEmitter);

var browser = new Browser();

browser.on("readyToCrawl", function() {
    browser.pageCreator.createPage(function(page) {
        page.open("https://pisaca-jelick.codio.io/Provinces/Gazetteer.htm", function(status){
            console.log("opened page: Gazeteer?", status);
            page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function(result) {
                 page.evaluate(function(){
                    $("#testdiv").html("Jquery Present");
                    return document.getElementById("testdiv").innerHTML;

                }, function(result) {
                    console.log("Page h1:", result);
                    browser.pageCreator.exit();
                });   
            });
        });
    });   
});
    
console.log("Log: Event Handler Attached")

function crawlPage (page,url) {
    if(typeof url != "string") throw "url needs to be a string";
    if(url.substring(0,5) !== "http") throw "second argument needs to be a url";
    
    page.open(url, function(status) {
        if(status !== "success") throw status;
        console.log("Opened Page:",url);
        
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function (result) {
            page.evaluate(function(){
                //payload goes here
                return $("title").html();          
                
            }), function (result) {
                console.log("result")
                page.close();
            }
            
        });
    })
}