/**
 * Created with Empire-Gazeteer-Crawler.
 * User: Racheet
 * Date: 2014-06-02
 * Time: 04:10 PM
 * To change this template use Tools | Templates.
 */
var phantom = require("phantom"),
    fs = require("fs");

var output = fs.createWriteStream("output/data.json", {
    "flags": "w",
    "encoding": "utf8"
});

var data = {};

phantom.create(function (instance) {
    instance.createPage (function(page) {
        page.open("https://pisaca-jelick.codio.io/Provinces/Gazetteer.htm", function(status){
            console.log("opened page: Gazeteer?", status);
            page.evaluate(function(){
                return document.title
            }, function(result) {
                console.log("Page Title", result);
                instance.exit();
            });
            
        })
    })
});
