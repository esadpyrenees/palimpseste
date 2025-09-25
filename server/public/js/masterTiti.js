

const socket = io();
let userid = null;

const offsetActionCode = 1000;
let selectedIndex = [];
let selectedCards = [];
let allCards = [];

const number = document.querySelector('#number');
// const submit = document.querySelector('#submit');
// submit.addEventListener('click', () => {
//   socket.emit("set players number", number.value);
//   number.remove()
//   submit.remove()
// })


async function getData() {
  const url = "js/cards.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const cards = [];
    const json = await response.json();

    let allCards = json;
    // json.forEach(entry => {
    //   if (selectedCards.length < 6) {
    //     let randindex = Math.floor(Math.random() * json.length);        
    //     selectedCards.push(json[Math.floor(Math.random() * json.length)]);  
    //     json.splice(randindex, 1);
    //     allCards.splice(randindex, 1);
    //   }
    // });
    // console.log(allCards);

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
        if (selectedCards.length < 6) {
            let randindex = Math.floor(Math.random() * cards.length);        
            selectedCards.push(cards[randindex]);  
            // cards.splice(randindex, 1);
            // allCards.splice(randindex, 1);
        }
    });

let button = document.querySelectorAll('button');

  selectedCards.forEach((entry, idx) => {    
    const btn = document.createElement('button');
    btn.dataset.textid = entry.card_number;
    btn.id = "btn" + idx;
    btn.className = entry.type;

    if (entry.card_number == 1102) {
      btn.className = "printit"  
    }
    
    btn.textContent = entry.text;
    document.querySelector('.texts').appendChild(btn);
    btn.onclick = () => {
    //   if (entry.type === "text") {
        let randindex = Math.floor(Math.random() * cards.length);        
        document.querySelector('#btn' + idx + '').innerHTML = cards[randindex].text;
        if (document.querySelector('#btn' + idx + '').classList[0] === "text") {
            document.querySelector('#btn' + idx + '').classList.remove('text');
        }
        else if(document.querySelector('#btn' + idx + '').classList[0] === "action"){
            document.querySelector('#btn' + idx + '').classList.remove('action');
        }
        document.querySelector('#btn' + idx + '').classList.add(cards[randindex].type);
        
        //   }
        console.log(entry.card_number);
        socket.emit("card change", btn.dataset.textid);
        document.querySelector('#btn' + idx + '').dataset.textid = cards[randindex].card_number;
    }
  });
    
})

