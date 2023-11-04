const pup = require('puppeteer');
const cherio = require('cherio');
const request = require('request');

const list = [];


const sleep = ms => new Promise(res => setTimeout(res, ms));
const url = 'https://www.amazon.com.br';
const searchfor = 'Livros';

let c = 1;

(async () => {

    const browser = await pup.launch({headless: false, args:["--no-sandbox",'--disable-setuid-sandbox']});
    const page = await browser.newPage();
    console.log('iniciei');

    await page.goto(url);
    console.log('fui para a url');
    
    await page.waitForSelector('#twotabsearchtextbox');//campo de pesquisa
    await page.type('#twotabsearchtextbox' , searchfor);

    console.log('pesquisei');

    
    await Promise.all([
        
        page.waitForNavigation(),
        page.click('#nav-search-submit-button')

    ]);

  const links =  await page.$$eval('.a-size-mini > a' , el => el.map(link => link.href));

  console.log(links);

for(const link of links){

    await page.goto(link);
    //await page.waitForSelector();
    
    const title = await page.$eval('#productTitle' , element => element.innerText);
    // const linkImg = await page.$eval('Seletor' , element => element.innerText);

    const obj = {};
    obj.title = title;

    list.push(obj);

    c++;
    console.log('pagina' , c);
}

console.log(list);




(async () => {
  console.log(new Date().getSeconds());
  await sleep(9000);
  console.log(new Date().getSeconds());
})();
   await browser.close();

    

})();
