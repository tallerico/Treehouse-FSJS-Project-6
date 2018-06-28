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
const logError = (error) => {
    fs.appendFile('./scraper-error.log',`${today} ${error}` + '\n', function (err) {
        if (err) throw err;
    });
}

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
},(err) => {
    console.log(err);
}).then(({ data, response }) => {
    const myData = data.tshirts;
    for (let tshirt of myData) {
        // console.log(tshirt.url);
        scrapePages(`http://shirts4mike.com/${tshirt.url}`);
    }
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    setTimeout(() => {
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(myShirts);
        fs.writeFile(`./data/${ymd}.csv`,csv, (err) =>{
            if(err != null) {
                console.log('There has been an error');
            }
        });
    }, 3000);
    // console.log(`Status Code: ${response.statusCode}`);
})


 
