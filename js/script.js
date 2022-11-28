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

const DEFAULT_FUEL = 30;

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createTheDate(date) {
    let time = "";
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();

    if(minutes < 10) {
        time += "0" + minutes
    } else {
        time += minutes
    }

    time += ":";

    if(seconds < 10) {
        time += "0" + seconds
    } else {
        time += seconds
    }

    return time;
}

let previousResults;

function showTheFinishPopUp(date, stars) {
    const popup = document.querySelector(".finish-popup");
    const replayButton = popup.querySelector(".finish__button");
    const currentResultsList = popup.querySelectorAll(".finish__list .finish__item");
    const previousResultsWrapper = popup.querySelector(".previous__results");
    const previousResultsList = previousResultsWrapper.querySelectorAll(".previous__list .previous__item");

    currentResultsList.forEach((result) => {
        switch(result.dataset.type){
            case "time":
                result.textContent = "Время: " + createTheDate(date);
                break;
            case "stars":
                result.textContent = "Количество звезд: " + stars;
                break;
        }
    })

    if(previousResults) {

    }
 
    popup.classList.remove("hidden");

    function replayButtonClickHandler(event) {
        event.preventDefault();

        popup.classList.add("hidden");

        startGame();

        replayButton.removeEventListener("click", replayButtonClickHandler);
    }

    replayButton.addEventListener("click", replayButtonClickHandler);
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
let gameOver;
let gamePause;

const fuelShowDown = document.querySelector(".stats__item.fuel");
const starsShowDown = document.querySelector(".stats__item.stars");
const timerShowDown = document.querySelector(".stats__item.timer");
const pauseButton = document.querySelector(".options__button.pause__button");

function startGame() {
    gamePause = false;
    gameOver = false;

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

    tilesMap = new TilesMap(canvas.width, canvas.height, 10, 10);

    clouds = [];
    birds = [];
    
    for (let i = 0; i < CLOUDS_AMOUNT; i++) {
        clouds.push(new Cloud());
    }
    
    for (let i = 0; i < BIRDS_AMOUNT; i++) {
        birds.push(new Bird());
    }

    star = new Star();
    dropOff = new DropOff();
    
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
        console.log("key")

        if(event.key == " ") {
            pauseGame()
        }
    }
    
    function keyUpHandler(event) {
        keyCheck(event.key, false);
    }

    function pauseGame() {
        gamePause = !gamePause;
        console.log("pause")
    }

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    pauseButton.addEventListener("click", pauseGame);

    let date = new Date(0);
    let secondsCounter = 0; 

    setInterval(() => {
        if(!gamePause) {
            secondsCounter++;
            
            date = new Date(0, 0, 0, 0, 0, secondsCounter);
        }
    }, 1000)
    
    function animate() {
        if(!gameOver){
            window.requestAnimationFrame(animate);

            fuelShowDown.textContent = dropOff.fuelCounter;
            starsShowDown.textContent = star.starsCounter;
            timerShowDown.textContent = createTheDate(date);
    
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
        } else {
            c.fillStyle = "white";
            c.fillRect(0, 0, canvas.width, canvas.height);
    
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener("keyup", keyUpHandler);
            pauseButton.removeEventListener("click", pauseGame);

            KEYS.a.pressed = false;
            KEYS.w.pressed = false;
            KEYS.s.pressed = false;
            KEYS.d.pressed = false;
            
            showTheFinishPopUp(date, star.starsCounter);
        }
    }
    animate();
}

startGame();