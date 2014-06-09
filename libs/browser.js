var phantom = require("phantom"),
    util    = require("util"),
    EventEmitter = require("events").EventEmitter;



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

module.exports = Browser;
