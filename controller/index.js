const { from } = require('rxjs');
const { map, toArray, mergeMap } = require('rxjs/operators');

const { generateHtmlCodeForResponse, fetchTitle } = require("../utils/getHtmlCode");

const getUrlsToGtTitles = async (req,res) =>{
    const addresses = req.query.address;

    if (!addresses) {
      return res.status(400).send('No address provided');
    }
  
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];
  
    // Create an Observable stream for each address
    from(addressArray).pipe(
      mergeMap(address => {
        let url = address.startsWith('http') ? address : `http://${address}`;
        return fetchTitle(url).pipe(
          map(title => `<li>${url} - "${title}"</li>`)
        );
      }),
      toArray()
    ).subscribe(results => {
        const htmlCode = generateHtmlCodeForResponse(results)
        res.status(200).send(htmlCode);
    
    });
}


module.exports =  { getUrlsToGtTitles }