var browser = require("libs/browser");


function crawlPage (url,payload,localDataBind) {
    "use strict";
    if(typeof url != "string") {throw new Error("url needs to be a string"); }
    if(url.match(/^https*:\/\//) === null) {throw new Error("third argument needs to be a url"); }
    
    browser.pageCreator.createPage(function(page) {
    
        page.open(url, function(status) {
            if(status !== "success") throw new Error(status);
            console.log("Opened Page:",url);

            page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function (result) {

                page.evaluate(payload,localDataBind);
				setTimeout(page.close,2000);                
            });
        });
    });
};

module.exports = crawlPage;