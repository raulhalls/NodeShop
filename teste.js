const pup = require('puppeteer');
const cherio = require('cherio');
const request = require('request');

const list = [];
const sleep = ms => new Promise(res => setTimeout(res, ms));
const url = 'https://www.amazon.com.br';
const searchfor = 'Livros';
const urlLivros = 'https://www.amazon.com.br/s?k=livros&__mk_pt_BR=ÅMÅŽÕÑ&crid=2X3H5JI3OGIRP&qid=1699089360&sprefix=livro%2Caps%2C277&ref=sr_pg_1';
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

    const linksLoop = async function () {

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
    }
    
    await linksLoop(); 

    await page.goto(urlLivros); 

    await Promise.all([
      page.waitForNavigation(),
      page.click('.s-pagination-next')
    ]);

    console.log('pagina 2 de compras');


    (async () => {
        await sleep(9000);
    })();

    await browser.close();
})();
