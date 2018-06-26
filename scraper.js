const scrapeIt = require('scrape-it');
const fs = require('fs');
const folderExist = fs.existsSync('./data');
const fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
const opts = { fields };

scrapeIt('http://shirts4mike.com/shirts.php', {
    tshirts: {
        listItem: ".products li"
        , name: "a"
        , data: {
             url: {
                  selector: "a"
                , attr: "href"
              },
              img: {
                  selector: "img",
                  attr: "src"
              }
          }
      }
    
}).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    console.log(data)
})


 
// try {
//   const parser = new Json2csvParser(opts);
//   const csv = parser.parse(myData);
//   console.log(csv);
// } catch (err) {
//   console.error(err);
// }