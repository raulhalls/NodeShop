import mysql from 'mysql';
import { list } from './scraping.js'; 

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

