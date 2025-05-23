

const socket = io();
let userid = null;

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
      cards.push({
        shortcut: entry.shortcut,
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
    btn.dataset.textid = entry.shortcut;
    btn.className = entry.type
    btn.textContent = entry.text;
    document.querySelector('.texts').appendChild(btn);
    btn.onclick = () => {
      console.log(entry.shortcut);
      socket.emit("card change", btn.dataset.textid);
    }
  });
    
})

