var crawlPage = require("libs/crawlPage.js");

function crawlProvincePage (thisProvince,callback){
    thisProvince = thisProvince || pagesToCrawl[0];
        
        crawlPage(thisProvince,function() {
            /* This function is run inside the province page on phantomJS, it returns a json string */
            var output = {},
                majorFeatures = [];
                
            
            output.name = $("title").text().trim().split(" - ")[0];
            output.history = $("#Recent_History").parent().nextUntil("h2,h3").text();
            output.overview = $("#Overview").parent().nextUntil("h2,h3").text();
            output.features = $("#Major_Features").parent().nextUntil("h2").filter("h3").map(function() {
                return {"name": $(this).text().trim(), "description": $(this).nextUntil("h2,h3").text().trim() } 
            }).get() ;
            output.regions = $("#Regions").parent().nextUntil("h2").filter("h3").map(function() {
                return {"name": $(this).text().trim(), "description": $(this).nextUntil("h2,h3").text().trim() } 
            }).get() ;
            output.regions.forEach(function(region) {
             if(typeof region.description == "string" && region.description.indexOf("Keywords") !== -1) {
                 region.keywords = region.description.split("Keywords:")[1];
                 $.trim(region.keywords);
                 region.keywords = region.keywords.split(" ");
                 region.keywords = region.keywords.filter(function(keyword) {return keyword !== "";})
                 region.description = region.description.split("Keywords:")[0];
                 $.trim(region.description);
             }
            });
            
            
            
            return JSON.stringify(output);
        }, function (result) {
            /* This function is called in the nodejs context, it recieves the json string from the above function */
            thisProvince = JSON.parse(result);
            console.log("Parsed:",thisProvince.name);
            if (typeof callback === "function") { callback(null,thisProvince); }
        });
        
};

module.exports = crawlProvincePage;