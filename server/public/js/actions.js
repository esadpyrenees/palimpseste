
const tbox = document.querySelector('#textbox');

const texte = ["",
    "Où est la place, si elle existe vraiment ?",
    "Plus rien ne pulse, plus rien ne bouge.",
    "Un silence s’étire entre les pensées.",
    "Depuis, tout échoue, tout glisse, hors de portée.",
    "Un souffle hésitant, comme une attente.",
    "Comment on fait, en cet instant où tout semble figé ?",
    "Reculer serait plus simple, mais après ?",
    "Où aller quand les chemins s’effacent ?",
    "Où elle est, cette certitude qui rassure ?",
    "Quand on doute, on s’égare, encore et encore.",
    "Qui suivre quand tout se contredit ?",
    "Avancer sans savoir, est-ce déjà réussir ?",
    "Plus rien ne pulse, plus rien ne répond.",
    "Y en a-t-il vraiment, des bons choix ?",
    "Où le doute prend tout, jusqu’aux mots.",
    "Qui croire, quand même sa propre voix vacille ?",
    "J’ai toujours voulu écrire, mais pourquoi déjà ?",
    "Écouter les autres ou s’écouter soi ?",
    "Le silence des autres pèse parfois plus que leurs mots.",
    "Ça fonctionnait, avant que tout ne bascule.",
    "Tout presse, tout pèse, tout fatigue.",
    "Avant, je savais, ou je croyais savoir.",
    "Comment on fait, quand rien ne semble suffire ?",
    "Si les choix sont bons, pourquoi le doute ?",
    "Un vide immense, une respiration coupée.",
    "Un vertige, une absence.",
    "Ou rien. Peut-être rien.",
    "Savoir où poser ses pas sans voir le sol.",
    "Écrire, encore, pour ne pas disparaître.",
    "Rester figé, comme une pause forcée.",
    "Réussir, mais selon qui ? Selon quoi ?",
    "Tout le temps, le même ressac du doute.",
    "Ou mauvais. Mais qui le sait ?",
    "Ça fonctionnait, mais autrement.",
    "Quand on ne sait plus, il ne reste que l’élan.",
    "Tout pèse, mais il faut bien continuer."];
    
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
    
    function ttotch() {
        const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans main
        paragraphs.forEach(p => {
            p.textContent = p.textContent
                .replace(/t/g, "tch")
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
    
    function saut() {
        const paragraphs = main.querySelectorAll('p'); // Sélectionne tous les <p> dans 'main'
        
        paragraphs.forEach((p, index) => {
            if (index < paragraphs.length - 1) {
                const br = document.createElement("br"); // Crée un élément <br>
                p.after(br); // Insère le <br> juste après ce <p>
            }
        });
    }

    function font() {

        const fonts = [
            "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New", "Comic Sans MS",
            "'Rubik Mono One'", "'Staatliches'", "'Unica One'",
            "'Press Start 2P'", "'VT323'", "'Share Tech Mono'",
            "'Nanum Brush Script'", "'Caveat'", "'Playfair Display'"
        ];
        const lastP = main.querySelector('p:last-child'); // Sélectionne le dernier <p>

        if (lastP) { // Vérifie si un <p> existe
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)]; // Choisit une police aléatoire
            lastP.style.fontFamily = randomFont; // Applique la police
        }
       
    }
         
    function corps() {
        const lastP = main.querySelector('p:last-child'); // Sélectionne le dernier <p>
    
            if (lastP) { // Vérifie si un <p> existe
                const randomSize = Math.floor(Math.random() * (100 - 10 + 1)) + 10; // Taille entre 10px et 100px
                lastP.style.fontSize = randomSize + "px"; // Applique la taille de police
            }

    }

    function textcolor() {
        const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        document.body.style.color = randomColor; // Change la couleur du texte sur toute la page

    }

    function reload() {
        location.reload(); // Recharge la page

    }
    
    function finish() {
        window.print(); // Ouvre la fenêtre d'impression

    }
   
    function applylettrine() {
        const p = main.querySelector('p:last-child');
        if (p) {
            const text = p.textContent;
            if (text.length > 0) {
                p.innerHTML = `<span style="font-size:2em; font-weight: bold; vertical-align: baseline;">${text[0]}</span>${text.slice(1)}`;
            }
        }
    
    }

    function spacing() {
        
        const p = main.querySelector('p:last-child');
        if (p) {
            const randomSpacing = (Math.random() * 3).toFixed(2) + "em"; // Valeur entre 0.00em et 3em
            p.style.letterSpacing = randomSpacing;
    }

             }

function alinea() {
                const p = main.querySelector('p:last-child');
                if (p) {
                    const randomIndent = (Math.random() * 8 + 2).toFixed(2) + "em"; // Valeur entre 2em et 10em
                    p.style.textIndent = randomIndent; // Applique un alinéa aléatoire
                }
            }

function alignement() {
    const alignments = ["left", "right", "center", "justify"];
    const randomAlign = alignments[Math.floor(Math.random() * alignments.length)];
    document.body.style.textAlign = randomAlign;
                
            }


function interlignage() {
    const randomLineHeight = (Math.random() * 5.4 + 0).toFixed(2);
    const lastP = document.querySelector('main'); 
    if (lastP) {
        lastP.style.lineHeight = randomLineHeight;
    
            }
        }
    
    function updateDateTime() {
        const datetime = document.getElementById('datetime');
        const now = new Date();
      
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
      
        datetime.textContent = now.toLocaleString('fr-FR', options);
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
        counterDisplay.textContent = `IMPRESSION NUMÉRO ${printCount}`;
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
        counterDisplay.textContent = `IMPRESSION NUMÉRO ${printCount}`;
    });
    
      // Met à jour l'heure immédiatement
      updateDateTime();
      
      // Puis toutes les secondes
      setInterval(updateDateTime, 1000);

