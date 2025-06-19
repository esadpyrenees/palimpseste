// import paged.js module
// import { log } from 'node:console';
import { Previewer } from './paged.esm.js';

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
    document.body.insertAdjacentElement("afterbegin", counterDisplay);

    doYourJob()
    
    
});
  
function doYourJob() {
    
    // gather all stylesheets within the document
    const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')].map(sheet => sheet.href);
    
    // gather all inline style tags
    const styles = [...document.querySelectorAll('style')];
    if (styles) {
        const inline_styles = styles.map(s => s.textContent).join("");
        // _nombidon is _really_ important
        stylesheets.push({ _nombidon: inline_styles })  
    }

    // instanciate the Previewer
    const previewer = new Previewer() 

    // run
    previewer.preview('', stylesheets);

    setTimeout(() => {
        window.print()
        // console.log("yop");
        
    }, 500);

}
