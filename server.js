const puppeteer = require('puppeteer');
const express = require('express');


const server = express();

server.get('/' , async(request , response) => {

        const bronwser = await puppeteer.launch();
        const page = await bronwser.newPage();
        await page.goto('https://www.amazon.com.br/s?k=livros&__mk_pt_BR=ÅMÅŽÕÑ&crid=19TPGH0O5NFRD&sprefix=livros%2Caps%2C344&ref=nb_sb_noss_1');
        await page.screenshot({path: 'example.png'});
    
        const dimensions = await page.evaluate(() => {
        return {

        title: document.querySelector('.a-section > span'),
        subtitle: document.querySelector('.formacao-headline-subtitulo'),
        widht: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFcator: window.devicePixelRatio

        }
        });

        console.log('conteudo' , dimensions);

        await bronwser.close();

        response.send({

            //api em json
        
            "id": 645755,
            "code": "javascript-front-end",
            "kind": "DEGREE",
            "kindDisplayName": "Formação",
            "kindSlugDisplayName": "formacao",
            "situation": "PUBLISHED",
            "title": "Desenvolva aplicações Web com JavaScript",
            "metaTitle": "",
            "subtitle": "Domine uma das linguagens de programação mais usadas no mercado e desenvolva um projeto com HTML, CSS e JavaScript do zero.",
            
        
        });



});

server.listen(3000, () => {
    console.log('servidor esta funcionando acessar http://localhost:3000');
});

//rotas 


