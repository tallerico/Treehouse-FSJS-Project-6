const scraper = require('scrape-it');
const fs = require('fs');
const csvParse = require('json2csv').Parser;
const folderExist = fs.existsSync('./data');

