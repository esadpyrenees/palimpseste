const socket = io();

socket.on('print', (msg) => {
    const text_to_print = msg.text_to_print;
    const print_counter = msg.print_counter  
    const tb = document.querySelector("#textbox");
    if(tb) tb.remove()
    document.body.insertAdjacentHTML("afterbegin", text_to_print);
    const counterDisplay = document.createElement("div");
    counterDisplay.textContent = print_counter;
    counterDisplay.id = "print-counter";
    document.body.appendChild(counterDisplay);

    window.print()
});
  