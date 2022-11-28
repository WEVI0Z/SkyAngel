"use strict"

const PLANE_IMG_URL = "../img/airplane.png";
const CLOUDS_IMG_URLS = [
    "../img/cloud1.png",
    "../img/cloud2.png",
    "../img/cloud3.png"
];
const BIRDS_IMG = "../img/birds.png";
const EXPLOAD_IMG = "../img/expload.png";
const STAR_URL = "../img/game-star.png";
const DROP_OFF_URL = "../img/parashute.png";

const KEYS = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const CLOUDS_AMOUNT = 4;
const BIRDS_AMOUNT = 2;

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1022;
canvas.height = 614;

let tilesMap;
let clouds = [];
let birds = [];
let star;
let dropOff;
let plane;

function startGame() {    
    let gamePause = false;

    plane = new Plane(
        {
            position: {
                x: 0,
                y: 0
            },
            imageSrc: PLANE_IMG_URL,
            scale: 0.5
        }
    );

    tilesMap = new TilesMap(canvas.width, canvas.height, 3, 3);
    
    for (let i = 0; i < CLOUDS_AMOUNT; i++) {
        clouds.push(new Cloud());
    }
    
    for (let i = 0; i < BIRDS_AMOUNT; i++) {
        birds.push(new Bird());
    }

    star = new Star();
    dropOff = new DropOff();
    
    
    function contolKeys() {
        function keyCheck(key, result) {
            switch (key) {
                case "w":
                    KEYS.w.pressed = result;
                    break;
                case "a":
                    KEYS.a.pressed = result;
                    break
                case "s":
                    KEYS.s.pressed = result;
                    break;
                case "d":
                    KEYS.d.pressed = result;
                    break
            }
        }
    
        function keyDownHandler(event) {
            keyCheck(event.key, true);

            if(event.key == " ") {
                gamePause = !gamePause;
            }
        }
        
        function keyUpHandler(event) {
            keyCheck(event.key, false);
        }
    
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);
    }
    
    function animate() {
        window.requestAnimationFrame(animate);

        if(!gamePause){
            c.fillStyle = "blue";
            c.fillRect(0, 0, canvas.width, canvas.height);
        
            clouds.forEach(cloud => {
                cloud.update();
            });
        
            plane.update();
        
            star.update();
        
            dropOff.update();
        
            birds.forEach(bird => {
                bird.update();
            });
        }
    }
    
    animate();
    contolKeys();    
}

startGame();