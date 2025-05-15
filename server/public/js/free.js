const socket = io();
let userid = null;

const text = document.querySelector('#text');
const submit = document.querySelector('#submit');
submit.addEventListener('click', () => {
  socket.emit("free text", text.value);
  text.remove()
  submit.remove()
})
