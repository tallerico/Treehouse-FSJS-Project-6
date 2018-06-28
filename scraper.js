const scrapeIt = require('scrape-it');
const Json2csvParser = require('json2csv').Parser;
const http = require('http');
const fs = require('fs');
const folderExist = fs.existsSync('./data');
let fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
let myShirts = [];
const opts = { fields };
const today = new Date();
const ymd = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

// creates log file and adds logs to file each time a error is thrown
function logError(error) {
    fs.appendFile('./scraper-error.log',`${today} ${error}` + '\n', function (err) {
        if (err) throw err;
    });
}

//function for scraping page of data
function scrapePages(pageURL) {
    scrapeIt(`${pageURL}`, {
        title:{
            selector: ".shirt-picture img",
            attr: "alt"
            },
            price: 'h1 .price',
            imageURL: {
                selector: ".shirt-picture img",
                attr: "src"
            }
        }
    ).then(({data,response}) => {
        //creating an object with the nameing convention so the csv file converter will work
        const obj = {
            Title: data.title,
            Price: data.price,
            ImageURL: data.imageURL,
            URL: pageURL,
            Time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        }
        myShirts.push(obj);
    })
}
//initial scraping of data that produces all the of the links for the tshirt pages
scrapeIt('http://shirts4mike.com/shirts.php', {
    tshirts: {
        listItem: ".products li"
        , name: "a"
        , data: {
             url: {
                  selector: "a"
                , attr: "href"
              }
          }
      } 
}).then(({ data, response }) => {
    const myData = data.tshirts;
    //looping through all pages and scraping each for data
    for (let tshirt of myData) {
        scrapePages(`http://shirts4mike.com/${tshirt.url}`);
    }
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    // letting data populate before creating csv
    setTimeout(() => {
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(myShirts);
        fs.writeFile(`./data/${ymd}.csv`,csv, (err) =>{
            if(err != null) {
                console.log('File not created.');
            }
        });
    }, 3000);
}).catch(function(error) {
    logError('Website is currently unavailiable.');
    console.log('Please check log for error details.');
});


 
