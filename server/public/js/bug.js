

const socket = io();
let userid = null;

const offsetActionCode = 1000;

let numero = '';

const buttons = document.querySelectorAll('button');
const result = document.querySelector('.result');
buttons.forEach(button => {
  button.onclick = () => {
    if (button.textContent == "×") {
      numero = numero.substring(0, numero.length - 1);
      result.textContent = numero
    } else if(button.textContent == "→"){
      socket.emit("card change", parseInt(numero)); 
      numero = '';
      result.textContent = '';
    } else {      
      numero += button.textContent
      result.textContent = numero
    }
    
  }
});

async function getData() {
  const url = "js/cards.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    

    const cards = [];
    const json = await response.json();
    console.log(json);
    json.forEach((entry, idx) => {
      let card_number = entry.shortcut;
      // si c’est une lettre
      if(isNaN(card_number)) {
        code_point = card_number.charCodeAt(0);
        card_number = offsetActionCode + code_point;
      }
      cards.push({
        card_number: card_number,
        text: entry.description,
        type: entry.type
      })
    });

    return cards;
  } catch (error) {
    console.error(error.message);
  }
}

getData().then((cards) => {
  cards.forEach(entry => {
    const btn = document.createElement('button');
    btn.dataset.textid = entry.card_number;
    btn.className = entry.type;

    if (entry.card_number == 1102) {
      btn.className = "printit"  
    }
    
    btn.textContent = entry.text;
    document.querySelector('.actions').appendChild(btn);
    btn.onclick = () => {
      console.log(entry.card_number);
      socket.emit("card change", btn.dataset.textid);
    }
  });
    
})

