import * as data from './scraping.js';

console.log(data);

//CRIAR CARDS 

function createCard(item) {
    const card = document.createElement('div');
    card.classList = 'card';
    
    const title = document.createElement('h5');
    title.textContent = item.title;
    card.appendChild(title);
    
    const image = document.createElement('img');
    image.src = item.src;
    card.appendChild(image);
    
    document.getElementById('output').appendChild(card);
  }
  
  // Esta função verifica novos itens no array e cria cards para eles
  async function checkForNewItems(array, lastIndex) {
    while (true) {
      while (lastIndex < array.length) {
        createCard(array[lastIndex]);
        lastIndex++;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera um segundo antes de verificar novamente
    }
  }
