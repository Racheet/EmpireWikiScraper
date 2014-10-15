EmpireWikiScraper
=================

A nodejs project which scrapes the Empire Larp Gazeteer and turns it into json.

Before running you'll need to install nodejs and download dependencies with `npm install`

To run use `node index.js --crawl` to crawl the wiki and convert the data to a local data.json file, and `node index.js --enrich` to enrich that scraped data with supplementary data and provide the finished province.json file.

The data will be output to the file /output/provinces.json