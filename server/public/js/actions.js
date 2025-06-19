
const texte = []

let selected = []


const main = document.querySelector('main');

function style() {
    const p = main.querySelector('p:last-child');

    if (p) {
        const styles = ["italic", "normal", "bold"];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];

        if (randomStyle === "bold") {
            p.style.fontStyle = "normal";
            p.style.fontWeight = "bold";
        } else {
            p.style.fontStyle = randomStyle;
            p.style.fontWeight = "normal";
        }
    }
}

// Exécute la fonction quand on appuie sur "g"
document.addEventListener("keydown", function(event) {
    if (event.key === "g") {
        style();
    }
});

function cloneP(){
    const p = main.querySelector('p:last-child');
    const clone = p.cloneNode(true)
    p.insertAdjacentElement('afterend', clone);
}
//function eto_ (){
    //const p = main.querySelector('p:nth-child(3)');
   // p.textContent = p.textContent.replace(/e/g, "_");
   // p.textContent = p.textContent.replace(/é/g, "_");
   // p.textContent = p.textContent.replace(/è/g, "_");
    //p.textContent = p.textContent.replace(/ê/g, "_");

//} 
function eto_() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/e/g, "_")
            .replace(/é/g, "_")
            .replace(/è/g, "_")
            .replace(/ê/g, "_")
            .replace(/E/g, "_")
            .replace(/É/g, "_")
            .replace(/È/g, "_")
            .replace(/Ê/g, "_");
    });
}

function atoo() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/a/g, "o")
            .replace(/A/g, "o")
            .replace(/à/g, "o")
            .replace(/À/g, "o");

    });
}

function gtok() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/g/g, "k")
            .replace(/G/g, "K")

    });
}

function stoss() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/s/g, "ss")
            .replace(/S/g, "SS")

    });
}


function vtow() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/v/g, "w")
    });
}

function stoz() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/s/g, "z")
    });
}

function dtodj() {
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
    paragraphs.forEach(p => {
        p.textContent = p.textContent
            .replace(/(?<=[a-zA-Z])d(?=[a-zA-Z])/g, "dj");
    });
}
   
function mix(){
    const p = main.querySelector('p:last-child');
    const words = p.textContent.split(" ");
    words.forEach((w,i) => {
        let j = Math.abs(i + Math.floor(Math.random() * 2 - 4));
        [words[i], words[j]] = [words[j], words[i]];    
    })    
    p.textContent = words.join(' ');
}
function begaie(){
    const p = main.querySelector('p:last-child');
    const words = p.textContent.split(" ");
    words.forEach((w,i) => {
        if(Math.random() > .8) {
            words[i] = w + " " + w.toLowerCase();    
        }
    })
    p.textContent = words.join(' ');
}

function break_lines(){
    const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p>
    paragraphs.forEach((p, index) => {
            if (index < paragraphs.length - 1) {
                const br = document.createElement("br"); // Crée un élément <br>
                p.after(br); // Insère le <br> juste après le <p>
            }
        });
}

function random_font(){
    const fonts = [
        "Arial", "Lora", "Savate","Roboto","Evolventa","EduVICWANTHandPre",
        "Dominik","Brixton","Adelphe","Bagnard","Intrepid","Rogbold","Mestika","Antique"
    ];
    const p = main.querySelector('p:last-child'); // Sélectionne le dernier <p>

    if (p) { // Vérifie si un <p> existe
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)]; // Choisit une police aléatoire
        p.style.fontFamily = randomFont; // Applique la police
    }
}

function random_corps(){
    const p = main.querySelector('p:last-child'); // Sélectionne le dernier <p>

    if (p) { // Vérifie si un <p> existe
        const randomSize = Math.floor(Math.random() * (6 - 0.5)) + 0.5; // Taille 
        p.style.fontSize = randomSize + "em"; // Applique la taille de police
    }
}

function reset(){
    // location.reload(); // Recharge la page
    document.querySelector("#textbox").removeAttribute('style');
    document.querySelector("#textbox").innerHTML = "";
}

function print(){
    console.log("old print function");
    // window.print(); // Ouvre la fenêtre d'impression
}

function apply_lettrine() {
    const p = main.querySelector('p:last-child');
    if (p) {
        const text = p.textContent;
        if (text.length > 0) {
            p.innerHTML = `<span style="font-size:2em; font-weight: bold; vertical-align: baseline; line-height: 0; position: relative; top: .2em;">${text[0]}</span>${text.slice(1)}`;
        }
    }
}

function letter_spacing(){
    const p = main.querySelector('p:last-child');
    if (p) {
        const randomSpacing = (Math.random() * 3).toFixed(2) + "em"; // Valeur entre 0.00em et 0.50em
        p.style.letterSpacing = randomSpacing;
    }
}

function alinea(){
    const p = main.querySelector('p:last-child');
    if (p) {
        p.style.textIndent = "10em"; // Applique un alinéa (modifiable à souhait)
    }
}

function random_align() {
        const alignments = ["left", "right", "center", "justify"];
        const randomAlign = alignments[Math.floor(Math.random() * alignments.length)];
        document.querySelector("#textbox").style.textAlign = randomAlign;
}


function interlignage(){
    const randomLineHeight = (Math.random() * 5.4 + 0).toFixed(2);
    const p = document.querySelector('main'); 
    if (p) {
        p.style.lineHeight = randomLineHeight;
    }
}

function add_text() {
    const main = document.querySelector('main');
    const p = main.querySelector('p:last-child');
    if (p) {
        p.textContent = p.textContent.trim() + ' Genre';
    }
}


const actions = {
    "q" : "cloneP",//-> ctrl c + ctrl p
    "e" : "eto_", //-> disparition
    "o" : "atoo", // a en o
    "k" : "gtok",
    "s" : "stoss",
    "w" : "vtow", // v en w
    "z" : "stoz", // s en z
    "a" : "dtodj",
    "m" : "mix", //-> Palindrome card
    "x" : "begaie",
    "l" : "apply_lettrine", 
    "h" : "break_lines",
    "p" : "random_font",
    "c" : "random_corps",
    "r" : "reset",
    "f" : "print",
    "b" : "letter_spacing",
    "v" : "alinea",
    "-" : "random_align",
    "i" : "interlignage",
    "g" : "style",
    "t" : "add_text"
}

  
// Affiche le compteur dès que la page est chargée
window.addEventListener("load", () => {
    let printCount = parseInt(localStorage.getItem("printCount")) || 0;

    // Crée un élément pour afficher le compteur si il n'existe pas
    let counterDisplay = document.getElementById("print-counter");
    if (!counterDisplay) {
        counterDisplay = document.createElement("div");
        counterDisplay.id = "print-counter";
        document.body.appendChild(counterDisplay);
    }
    counterDisplay.textContent = `FRAGMENT NUMÉRO ${printCount}`;
});

// Augmente le compteur à chaque impression et l'affiche
window.addEventListener("beforeprint", () => {
    let printCount = parseInt(localStorage.getItem("printCount")) || 0;

    // Incrémente le compteur
    printCount++;

    // Sauvegarde le nouveau compteur
    localStorage.setItem("printCount", printCount);

    // Met à jour l'affichage du compteur
    let counterDisplay = document.getElementById("print-counter");
    counterDisplay.textContent = `FRAGMENT NUMÉRO ${printCount}`;
});

// if(form){
//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const val = input.value
//         // si c’est un chiffre
//         if(!isNaN(val)) {
//             // uniquement si le fragment n’a pas déjà été ajouté
//             if( !selected.includes(val)){
//                 selected.push(val)
//                 const p = document.createElement('p');
//                 p.textContent = texte[val]
//                 main.appendChild(p);            
//             }
//         } else {
//             // si c’est une lettre
//             if(actions.hasOwnProperty(val)) {
//                 const action = actions[val];
//                 window[action]();
//             }
//         }
//         input.value = "";
//         input.focus()
        
//     })
// }