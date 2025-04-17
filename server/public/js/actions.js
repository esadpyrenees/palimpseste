
const tbox = document.querySelector('#textbox');

function italicize() {
    const p = tbox.querySelector('p:last-child');
    p.style.fontStyle = "italic";
};
function bolden(){
    const p = tbox.querySelector('p:last-child');
    p.style.fontWeight = "bold";
};
function bolden3rd(){
    const p = tbox.querySelector('p:nth-child(3)');
    p.style.fontWeight = "bold";
};
function cloneP(){
    const p = tbox.querySelector('p:last-child');
    const clone = p.cloneNode(true)
    p.insertAdjacentElement('afterend', clone);
}
function etoA(){
    const p = tbox.querySelector('p:last-child');
    p.textContent = p.textContent.replace(/e/g, "a")
    p.textContent = p.textContent.replace(/u/g, "o")
    p.textContent = p.textContent.replace(/s/g, "k")    
}
function mix(){
    const p = tbox.querySelector('p:last-child');
    const words = p.textContent.split(" ");
    words.forEach((w,i) => {
        let j = Math.abs(i + Math.floor(Math.random() * 2 - 4));
        [words[i], words[j]] = [words[j], words[i]];    
    })    
    p.textContent = words.join(' ');
}
function begaie(){
    const p = tbox.querySelector('p:last-child');
    const words = p.textContent.split(" ");
    words.forEach((w,i) => {
        if(Math.random() > .8) {
            words[i] = w + " " + w.toLowerCase();    
        }
    })
    p.textContent = words.join(' ');
}

