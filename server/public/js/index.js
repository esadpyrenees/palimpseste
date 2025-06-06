const socket = io();
let userid = null;

const offsetActionCode = 1000;

const cards_to_text = {}
const cards_to_actions = {}

const textbox = document.querySelector('#textbox');

async function getData() {
  const url = "js/cards.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const texts = [];
    const json = await response.json();
    json.forEach((entry, idx) => {
      switch (entry['type']) {
        case "text":
          cards_to_text[entry.shortcut] = entry.description
          break;
        case "action":
          cards_to_actions[entry.shortcut] = entry
          break;
        default:
          break;
      }         
    });

    return texts;
  } catch (error) {
    console.error(error.message);
  }
}

getData().then(() => {
  console.log(cards_to_text);
})



// --------------------------- socket

// on connection, server sends back a welcome message to client width the socket id
socket.on('welcome', (id) => {
  userid = id;  
  console.log("My id is " + userid);
});


// --------------------------- send message
function sendMessage(msg){  
  console.log("message !");
  // console.log(msg);
  socket.emit("message", msg);
}


// --------------------------- receive messages
socket.on('card change', (card_number) => {
  console.log(`Nouvelle carte détectée: ${card_number} !`);
  
  // si le numéro de carte est entre 0 et 1000 : c'est une carte texte
  if (card_number < offsetActionCode){
    card_shortcut = card_number;
  }else{ // sinon c'est une carte ation, il faut retourver la lettre du shortcut
    card_shortcut = String.fromCodePoint(card_number - offsetActionCode);
  }

  const text = cards_to_text[card_shortcut] ?? null;
  const action = cards_to_actions[card_shortcut] ?? null;
  if(text) {
    textbox.insertAdjacentHTML("beforeend", `<p>${text}</p>`)
  }
  if(action) {
    const fn = window[action["action"]]
    if(typeof fn === "function"){
      fn()
    }
  }
 
});


// --------------------------- receive messages
socket.on('free text', (text) => {
  console.log(`Nouveau message : ${text} !`);
  if(text) {
    textbox.insertAdjacentHTML("beforeend", `<p>${text}</p>`)
  }  
});




// --------------------------- receive messages
// socket.on('master action', (action_id) => {
//   const action = cards_to_actions[action_id] ?? null;
//   console.log(`Nouvelle action (master) : ${action} !`);
//   const fn = window[action]
//     if(typeof fn === "function"){
//       fn()
//     }  
// });

