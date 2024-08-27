const axios = require('axios');
const { from } = require('rxjs');
const { map, catchError } = require('rxjs/operators');


const generateHtmlCodeForResponse = (listItems)=>{
    const htmlResponse = `
    <html>
    <head></head>
    <body>
        <h1>Following are the titles of given websites:</h1>
        <ul>
            ${listItems.join('')}
        </ul>
    </body>
    </html>`;


    return htmlResponse;
}

function fetchTitle(url) {
    return from(axios.get(url)).pipe(
      map(response => {
        const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : 'NO TITLE FOUND';
      }),
      catchError(() => {
        // If fetching with `http` fails, try `https`
        if (url.startsWith('http://')) {
          url = url.replace('http://', 'https://');
        } else if (!url.startsWith('https://')) {
          url = `https://${url}`;
        }
        // Retry with https if the first attempt fails
        return from(axios.get(url)).pipe(
          map(response => {
            const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
            return titleMatch ? titleMatch[1].trim() : 'NO TITLE FOUND';
          }),
          catchError(() => 'NO RESPONSE') // Return 'NO RESPONSE' in case of error
        );
      })
    );
  }


module.exports = { generateHtmlCodeForResponse, fetchTitle}