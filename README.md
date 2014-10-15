EmpireWikiScraper
=================

A nodejs project which scrapes the Empire Larp Gazeteer and turns it into json.

Before running you'll need to install nodejs and download dependencies with `npm install`. You will also need a copy of phantomjs in a directoy in your $PATH. You can install this via your standard package manager or npm. To install it globally via npm use the command `npm install phantomjs -g`.

To run use `node index.js --crawl` to crawl the wiki and convert the data to a local data.json file, and `node index.js --enrich` to enrich that scraped data with supplementary data and provide the finished province.json file.

The data will be output to the file /output/provinces.json