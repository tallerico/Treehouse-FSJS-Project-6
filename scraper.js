const scrapeIt = require('scrape-it');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const folderExist = fs.existsSync('./data');
let fields = [];
let myShirts = [];
const opts = { fields };
const today = new Date();

function Tshirt(title,price, imgURL, url, curTime) {
    this.title = title;
    this.price = title;
    this.imgURL = title;
    this.title = title;
    this.title = title;
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
            ImageUrl: data.imageURL,
            URL: pageURL,
            Time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        }
        myShirts.push(obj);
    })
}

// scrapePages('http://shirts4mike.com/shirt.php?id=102');

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
    for (let tshirt of myData) {
        // console.log(tshirt.url);
        scrapePages(`http://shirts4mike.com/${tshirt.url}`);
    }
    
    console.log(`Status Code: ${response.statusCode}`);
})

setTimeout(() => console.log(myShirts), 5000);

 
