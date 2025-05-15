const socket = io();
let userid = null;

const cards_to_text = {
  103: "Salut tout le monde",
  102: "Comment ça va ?"  
}
const cards_to_actions = {
  103: "italicize",
  "q": "italicize",
  10: "begaie"
}

const textbox = document.querySelector('#textbox');

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

  const text = cards_to_text[card_number] ?? null;
  const action = cards_to_actions[card_number] ?? null;
  if(text) {
    textbox.insertAdjacentHTML("beforeend", `<p>${text}</p>`)
  }
  if(action) {
    const fn = window[action]
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
socket.on('master action', (action_id) => {
  const action = cards_to_actions[action_id] ?? null;
  console.log(`Nouvelle action (master) : ${action} !`);
  const fn = window[action]
    if(typeof fn === "function"){
      fn()
    }  
});

