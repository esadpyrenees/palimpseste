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

const cartes = document.getElementsByClassName("carte")
let idc = 0
//liste = [a=function(),b=function()]
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
                p.rect((i + 1) * splitsX, 0, w, w);
            }

            for (let i = 0; i < bottom.length; i++) {
              p.fill(0,p.map(bottom[i], 0, 1, 0, 255));
              p.rect((i + 1) * splitsX, p.height, w, w);
            }

            // gauche et droite pour l'encodage
            let left = code.slice(0, 6);
            let right = code.slice(6, 12);

            let splitsY = p.height / 7;
            let h = p.height / 8;
            for (let i = 0; i < right.length; i++) {
                p.fill(0,p.map(right[i], 0, 1, 0, 255));
                p.rect(p.width, (i + 1) * splitsY, w, w);
            }

            for (let i = 0; i < left.length; i++) {
                p.fill(0,p.map(left[i], 0, 1, 0, 255));
                p.rect(0, (i + 1) * splitsY, w, w);
            }
        }
    }, "d" + idc)
    idc++;

}

/*
  code = dec2bin(230,16)
  console.log(code)
  function setup() {
    createCanvas(600, 1300);
    noLoop();
    rectMode(CENTER);
    noStroke();
  }
  
  function draw() {
    background(200);
  
    let top = code.slice(0, 2);
    let right = code.slice(2, 8);
    let bottom = code.slice(8, 10);
    let left = code.slice(10, 16);
  
    let splitsX = width / 3;
    let w = width / 4;
    for (let i = 0; i < top.length; i++) {
      fill(map(top[i],0,1,255,0) );
      rect((i + 1) * splitsX, 0, w, w);
    }
  
    let splitsY = height / 7;
    let h = height / 8;
    for (let i = 0; i < right.length; i++) {
      fill(map(right[i],0,1,255,0) );
      rect(width, (i + 1) * splitsY, w, w);
    }
  
    for (let i = 0; i < bottom.length; i++) {
      fill(map(bottom[i],0,1,255,0) );
      rect(width - (i + 1) * splitsX, height, w, w);
    }
  
    for (let i = 0; i < left.length; i++) {
      fill(map(left[i],0,1,255,0) );
      rect(0, height - (i + 1) * splitsY, w, w);
    }
  }
    */