const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pageFetcher = (url, dest) => {
  request(url, (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    if (!fs.existsSync(dest)) {
      fs.writeFile(dest, body, (err) => {
        if (err) throw err;
        console.log(`Downloaded and saved to ${dest}`);
      });
    }
    if (fs.existsSync(dest)) {
      rl.question(`${dest} already exists. Overwrite file? [Y/N] `, (answer) => {
        rl.close();
        if (answer === 'y' || answer.toLowerCase() === 'y') {
          fs.writeFile(dest, body, (err) => {
            if (err) throw err;
            console.log(`Downloaded and saved to ${dest}`);
          });
        } else {
          console.log("Invalid input. Input must be [Y/N]");
        }
      });
    } else {
      rl.close();
    }
  });
};

rl.question("Enter page URL to download: ", (pageUrl) => {
  rl.question("Enter destination file path: ", (destPath) => {
    pageFetcher(pageUrl, destPath);
  });
});