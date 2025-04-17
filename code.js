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

            p.createCanvas(carte.getBoundingClientRect().width, carte.getBoundingClientRect().height);
            code = dec2bin(carte.dataset["code"], 16)
            p.rectMode(p.CENTER);
            p.noStroke();
            p.fill("black")
            console.log(code)
            let top = code.slice(0, 2);
            let right = code.slice(2, 8);
            let bottom = code.slice(8, 10);
            let left = code.slice(10, 16);

            let splitsX = p.width / 3;
            let w = p.width / 4;
            for (let i = 0; i < top.length; i++) {
                p.fill(0,p.map(top[i], 0, 1, 0, 255));
                p.rect((i + 1) * splitsX, 0, w, w);
            }

            let splitsY = p.height / 7;
            let h = p.height / 8;
            for (let i = 0; i < right.length; i++) {
                p.fill(0,p.map(right[i], 0, 1, 0, 255));
                p.rect(p.width, (i + 1) * splitsY, w, w);
            }

            for (let i = 0; i < bottom.length; i++) {
                p.fill(0,p.map(bottom[i], 0, 1, 0, 255));
                p.rect(p.width - (i + 1) * splitsX, p.height, w, w);
            }

            for (let i = 0; i < left.length; i++) {
                p.fill(0,p.map(left[i], 0, 1, 0, 255));
                p.rect(0, p.height - (i + 1) * splitsY, w, w);
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