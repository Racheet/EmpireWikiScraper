var phantom = require("phantom"),
    util    = require("util"),
    EventEmitter = require("events").EventEmitter;



var Browser = function() {
    "use strict";
    var self = this;
    EventEmitter.call(this);
    
    //Stubs
    self.exit = null;
    self.pageCreator = null;
    self.createPage = null;
   
    //Initialise PhantomJs
    phantom.create(function (instance) {
        self.pageCreator = instance;
        self.exit = instance.exit;
        self.createPage = instance.createPage;
        self.emit("readyToCrawl");
    });   
    
    //Api Function For Crawling a Page;
    self.crawlPage = function crawlPage(url, payload, localDataBind) {
         if(typeof url != "string") {
             throw new Error("url needs to be a string");
         }
         if(url.match(/^https*:\/\//) === null) {
             throw new Error("third argument needs to be a url");
         }
         if (self.pageCreator) {
             self.pageCreator.createPage(function(page) {
                 page.open(url, function(status) {
                     if(status !== "success") throw new Error(status);
                     console.log("Opened Page:", url);
                     page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function(result) {
                         page.evaluate(payload, localDataBind);
                         setTimeout(page.close, 2000);
                     });
                 });
             });
         } else {
             setTimeout(function(){self.crawlPage(url,payload,localDataBind);},1000); // if phantomJS not loaded yet sleep 1 second then try again. 
             return; // kill this stack frame;
         }
        
     };  
    
    return self;
};

util.inherits(Browser,EventEmitter);

module.exports = new Browser();
