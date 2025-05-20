

const socket = io();
let userid = null;

const number = document.querySelector('#number');
const submit = document.querySelector('#submit');
submit.addEventListener('click', () => {
  socket.emit("set players number", number.value);
  number.remove()
  submit.remove()
})

let actions = "qeokszaàmxlhpctrfbvi_".split("");

for (let index = 0; index < actions.length; index++) {
  const action = actions[index];
  const btn = document.createElement('button');
  btn.dataset.action = action;
  btn.textContent = action;
  document.querySelector('.actions').appendChild(btn)
  btn.onclick = () => {
    socket.emit("master action", btn.dataset.action);
  }  
}

const texte = [
  "texte super long qui dépasse",
  "text 2"
];

for (let index = 1; index <= texte.length; index++) {
  const t = texte[index-1];
  const btn = document.createElement('button');
  btn.dataset.textid = index;
  btn.textContent = t;
  document.querySelector('.texts').appendChild(btn)
  btn.onclick = () => {
    socket.emit("master text", btn.dataset.textid);
  }  
}



