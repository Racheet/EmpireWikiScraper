#! /usr/bin/node
var program = require("commander"),
    crawler = require("./crawler/index.js"),
    dataEnricher = require("./data-enricher/index.js");

program
    .version("2.0.0")
    .option("-c , --crawl","crawl wiki and produce provinces.json")
    .option("-e , --enrich", "enrich provinces.json with additional data")
    .parse(process.argv);
    
if (program.crawl) {
    crawler();
} else if (program.enrich) {
    dataEnricher();
}
