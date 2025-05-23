function dec2bin(dec, cells) {
    str = (dec >>> 0).toString(2)
    if (str.length < cells) {
        let adder = cells - str.length
        for (let i = 0; i < adder; i++) {
            str = "0" + str
        }
    }
    return str;
}

async function getData() {
  const url = "js/cards.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const cards = [];
    const json = await response.json();
    json.forEach((entry, idx) => {

      const card = document.createElement('div');
      card.dataset.code = idx;
      card.className = "carte " + entry.type;
      const desc = entry.description.replaceAll('/', "<br>");
      card.innerHTML = `<h3>${entry.overtitle}</h3>
      <p>${desc}</p>
      <footer>${entry.subtitle}</footer>`;
      cards.push(card);
      document.body.appendChild(card);

         
    });

    return cards;
  } catch (error) {
    console.error(error.message);
  }
}

getData().then((cards) => {
  createCodes(cards);
})

let idc = 0
//liste = [a=function(),b=function()]
function createCodes(cartes){
  for (const carte of cartes) {
      carte.id = "d" + idc
      // let window["myfunc"] = function(p) {

      // }
      new p5((p) => {

          p.setup = function () {

              p.createCanvas(carte.getBoundingClientRect().width, carte.getBoundingClientRect().height); // taille du canevas dépend de la taille d'affichage de l'élément du DOM. choisir une résolution ?
              code = dec2bin(carte.dataset["code"], 12)
              carte.dataset["bin"] = code
              p.rectMode(p.CENTER);
              p.noStroke();
              p.fill("black")
              console.log(code)
    
              let w = p.width / 4;
              const epaisseur = 24;

              // top & bottom pour l'orientation 
              let top = [1,0];
              let bottom = [0, 1];

              if(carte.dataset["invert"]){
                top.reverse()
                bottom.reverse()
              }

              let splitsX = p.width / 3;
              for (let i = 0; i < top.length; i++) {
                  p.fill(0,p.map(top[i], 0, 1, 0, 255));
                  p.rect((i + 1) * splitsX, 0, w, epaisseur);
              }

              for (let i = 0; i < bottom.length; i++) {
                p.fill(0,p.map(bottom[i], 0, 1, 0, 255));
                p.rect((i + 1) * splitsX, p.height, w, epaisseur);
              }

              // gauche et droite pour l'encodage
              let left = code.slice(0, 6);
              let right = code.slice(6, 12);

              let splitsY = p.height / 7;
              let h = p.height / 8;
              for (let i = 0; i < right.length; i++) {
                  p.fill(0,p.map(right[i], 0, 1, 0, 255));
                  p.rect(p.width, (i + 1) * splitsY, epaisseur, w);
              }

              for (let i = 0; i < left.length; i++) {
                  p.fill(0,p.map(left[i], 0, 1, 0, 255));
                  p.rect(0, (i + 1) * splitsY, epaisseur, w);
              }
          }
      }, "d" + idc)
      idc++;

  }

}
