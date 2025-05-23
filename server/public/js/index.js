const socket = io();
let userid = null;

const cards_to_text = {}
const cards_to_actions = {}

const textbox = document.querySelector('#textbox');

const actions_dict = {
  "q" : "cloneP",//-> ctrl c + ctrl p
  "e" : "eto_", //-> disparition
  "o" : "atoo", // a en o
  "k" : "gtok",
  "s" : "stoss",
  "w" : "vtow", // v en w
  "z" : "stoz", // s en z
  "a" : "dtodj",
  "à" : "ttotch",
  "m" : "mix", //-> Palindrome card
  "x" : "begaie",
  "l" : "apply_lettrine", 
  "h" : "break_lines",
  "p" : "random_font",
  "c" : "random_corps",
  "t" : "random_color",
  "r" : "reset",
  "f" : "print",
  "b" : "letter_spacing",
  "v" : "alinea",
  "-" : "random_align",
  "i" : "interlignage",
  "g" : "style"
}


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
          cards_to_actions[entry.shortcut] = entry.description
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

  const text = cards_to_text[card_number] ?? null;
  const action = actions_dict[card_number] ?? null;
  if(text) {
    textbox.insertAdjacentHTML("beforeend", `<p>${text}</p>`)
  }
  if(action) {
    
    const fn = window[action]
    if(typeof fn === "function"){
      console.log("ici !");
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

