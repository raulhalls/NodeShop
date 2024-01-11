const pup = require('puppeteer');

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

        let promises = []; // array para armazenar todas as promessas

        for(const link of links){
            let promise = new Promise(async (resolve, reject) => {
                try {
                    await page.goto(link);
                   // await page.waitForNavigation({ waitUntil: 'networkidle0' }); // aguardar o carregamento da página
                    console.log(await page.url()); // imprimir a URL atual
                    const title = await page.$eval('#productTitle' , element => element.innerText);
                    const imageElement = await page.waitForSelector('#imgTagWrapperId > img');
                    const imageProp = await imageElement.getProperty("src");
                    const imageSrc = await imageProp.jsonValue();
                    
                    const obj = {};
                    obj.title = title;
                    obj.src = imageSrc;
                    list.push(obj);
                    c++;
                    console.log('pagina' , c);
                    resolve(); // resolver a promessa quando terminar
                } catch (error) {
                    console.error(`Erro ao navegar para ${link}: ${error}`);
                    resolve(); // ainda resolver a promessa para não bloquear as outras
                }
            });
        
            promises.push(promise); // adicionar a promessa ao array
        }

        await Promise.all(promises); // esperar todas as promessas serem resolvidas
        console.log(list);
    }
    
    while (true) {
        await linksLoop(); 

        await page.goto(urlLivros); 

        await Promise.all([
          page.waitForNavigation(),
          page.click('.s-pagination-next')
        ]);


        //console.log('proxima página');

        await linksLoop();

    }

    for (const obj of list) { 
        console.log(`Título: ${obj.title}, Fonte: ${obj.src}`);
    }

   /* (async () => {
        await sleep(9000);
    })();

    await browser.close();*/
})();
 