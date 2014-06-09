function crawlPage (browser,page,url,payload,localDataBind) {
    "use strict";
    if(typeof url != "string") {throw "url needs to be a string"; }
    if(url.match(/^https*:\/\//) === null) {throw "second argument needs to be a url"; }
    
    page.open(url, function(status) {
        if(status !== "success") throw status;
        console.log("Opened Page:",url);
        
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function (result) {
            
            page.evaluate(payload,localDataBind);
            
        });
    })
};

module.exports = crawlPage;