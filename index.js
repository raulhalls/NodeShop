const pup = require('puppeteer');


const url = 'https://www.mercadolivre.com.br';
const searchfor = 'Livros';

let c = 1;



(async () => {

const browser = await pup.launch({headless: false, args:["--no-sandbox",'--disable-setuid-sandbox']});
const page = await browser.newPage();

await page.goto(url);
console.log('fui a url');

console.log('o servidor esta iniciado');

await page.waitForSelector('#twotabsearchtextbox');//campo de pesquisa

await page.type('#twotabsearchtextbox' , searchfor);//campo de pesquisa

await Promise.all([
    page.waitForNavigation(),
    page.Click('#nav-search-submit-button')
])

const links = await page.$$eval('.s-product-image-container > a' , el => el.map(link => link.href));

for (const link of links){
    
    console.log('pagina' , c);

    await page.goto(link);

    const title = await page.$eval('.classe do titulo' , element => element.innerText);
    const subtitle = await page.$eval('.classe do subtitulo' , element => element.innerText);
    const linkProduto = await page.$eval('.classe onde esta o link' , element => element.innerText);
    const precoProduto = await page.$eval('.a-price-whole' , element => element.innerText);

    const obj = { title , subtitle , linkProduto , precoProduto}

    console.log(obj);

    c++;

}

await page.waitForTimeout(3000);
await browser.close();

})

