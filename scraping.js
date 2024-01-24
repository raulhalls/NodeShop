import pup from 'puppeteer';
import mysql from 'mysql';


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
            const title = await page.$eval('#productTitle' , element => element.innerText);
            const imageElement = await page.waitForSelector('#imgTagWrapperId > img');
            const imageProp = await imageElement.getProperty("src");
            const imageSrc = await imageProp.jsonValue();
            
            const obj = {};
            obj.id = c;
            obj.title = title;
            obj.src = imageSrc;
            list.push(obj);
            c++;
            console.log('pagina' , c);
        }
        console.log(list);
    }
    
    while (true) {
        await linksLoop(); 

        await page.goto(urlLivros); 

        await Promise.all([
          page.waitForNavigation(),
          page.click('.s-pagination-next')
        ]);


        console.log('proxima página');

        await linksLoop();

    }
    
/*

    (async () => {
        await sleep(9000);
    })();

    await browser.close();*/
})();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3308, 
    password: '1234',
    database: 'SCRAPPING'
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('Erro ao conectar: ' + err.stack);
      return;
    }
  
    console.log('Conectado como id ' + connection.threadId);
  });
  
  async function insertData() {
    for (let item of list) {
      const query = 'INSERT INTO CARDS (id ,title, src) VALUES (?, ?, ?)';
      await new Promise((resolve, reject) => {
        connection.query(query, [item.id , item.title, item.src], function(err, results, fields) {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log(`Inserido ID: ${item.id}, title: ${item.title}, src: ${item.src}`);
            resolve();
          }
        });
      });
    }
  }
  
  async function scrapeAndInsert() {
    await new Promise(async (resolve, reject) => {
      await linksLoop();
      resolve();
    });
      
    await insertData();
  
    connection.end(function(err) {
      if (err) {
        console.error('Erro ao encerrar: ' + err.stack);
        return;
      }
  
      console.log('Conexão encerrada');
    });
  }

export { list };

