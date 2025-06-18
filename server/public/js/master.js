

const socket = io();
let userid = null;

const offsetActionCode = 1000;

const number = document.querySelector('#number');
const submit = document.querySelector('#submit');
submit.addEventListener('click', () => {
  socket.emit("set players number", number.value);
  number.remove()
  submit.remove()
})


async function getData() {
  const url = "js/cards.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const cards = [];
    const json = await response.json();
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
    document.querySelector('.texts').appendChild(btn);
    btn.onclick = () => {
      console.log(entry.card_number);
      socket.emit("card change", btn.dataset.textid);
    }
  });
    
})

