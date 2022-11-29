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

const BACKGROUND_SND_URL = "../snd/background.mp3";
const FINISH_SND_URL = "../snd/finish.mp3";
const HIT_SND_URL = "../snd/hit.mp3";
const STAR_SND_URL = "../snd/star.mp3";

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

const optionsWrapper = document.querySelector(".environment__menu");
let fontSize = 30;

optionsWrapper.style.fontSize = fontSize + "px";

const backgroundSound = new Audio();
backgroundSound.src = BACKGROUND_SND_URL;
backgroundSound.autoplay = true;

backgroundSound.addEventListener("ended", (event) => {
    backgroundSound.play();
})

const finishSound = new Audio();
finishSound.src = FINISH_SND_URL;

const hitSound = new Audio();
hitSound.src = HIT_SND_URL;

const starSound = new Audio();
starSound.src = STAR_SND_URL;

const pauseButton = document.querySelector(".options__button.pause__button");
const muteButton = document.querySelector(".options__button.sound__button");
const fontSizeUpButton = document.querySelector(".sound-control__button.encrease-sound-button");
const fontSizeDownButton = document.querySelector(".sound-control__button.decrease-sound-button");

function muteGame() {
    backgroundSound.muted = !backgroundSound.muted;
    finishSound.muted = !finishSound.muted
    hitSound.muted = !hitSound.muted;
    starSound.muted = !starSound.muted;
}

function encreaseFontSize() {
    if(fontSize < 40) {
        fontSize += 5;
        optionsWrapper.style.fontSize = fontSize + "px";
    }
}

function decreaseFontSize() {
    if(fontSize > 20) {
        fontSize -= 5;
        optionsWrapper.style.fontSize = fontSize + "px";
    }
}

muteButton.addEventListener("click", muteGame);
fontSizeUpButton.addEventListener("click", encreaseFontSize);
fontSizeDownButton.addEventListener("click", decreaseFontSize);

function mainMenuControl() {
    const mainMenuWrapper = document.querySelector(".main-menu");
    const startButton = mainMenuWrapper.querySelector(".main-menu__start-button");
    const gameWrapper = document.querySelector(".gaming-environment");

    function startButtonClickHandler() {
        startGame();
        gameWrapper.classList.remove("hidden");
        mainMenuWrapper.classList.add("hidden");
    }

    startButton.addEventListener("click", startButtonClickHandler);
}

let previousResults = {};

function showTheFinishPopUp(date, stars) {
    const popup = document.querySelector(".finish-popup");
    const replayButton = popup.querySelector(".finish__button");
    const currentResultsList = popup.querySelectorAll(".finish__list .finish__item");
    const previousResultsWrapper = popup.querySelector(".previous__results");
    const previousResultsList = previousResultsWrapper.querySelectorAll(".previous__list .previous__item");
    const finishHeader = popup.querySelector(".finish__header");
    const previousHeader = popup.querySelector(".previous__header");

    const resultDate = createTheDate(date);

    popup.style.fontSize = fontSize + "px";
    finishHeader.style.fontSize = fontSize + "px";
    previousHeader.style.fontSize = fontSize + "px";
    replayButton.style.fontSize = fontSize + "px";

    finishSound.play();
    backgroundSound.pause();

    currentResultsList.forEach((result) => {
        switch(result.dataset.type){
            case "time":
                result.textContent = "Время: " + resultDate;
                break;
            case "stars":
                result.textContent = "Количество звезд: " + stars;
                break;
        }
    })

    if(previousResults.stars >= 0) {
        previousResultsWrapper.classList.remove("hidden")
        previousResultsList.forEach((result) => {
            switch(result.dataset.type){
                case "time":
                    result.textContent = "Время: " + previousResults.date;
                    break;
                case "stars":
                    result.textContent = "Количество звезд: " + previousResults.stars;
                    break;
            }
        })
    }

    previousResults.date = resultDate;
    previousResults.stars = stars;
 
    popup.classList.remove("hidden");

    function replayButtonClickHandler(event) {
        event.preventDefault();

        popup.classList.add("hidden");

        startGame();

        replayButton.removeEventListener("click", replayButtonClickHandler);
        backgroundSound.play();
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
        event.preventDefault();

        keyCheck(event.key, true);

        if(event.key == " ") {
            pauseGame()
        }
    }
    
    function keyUpHandler(event) {
        keyCheck(event.key, false);
    }

    function pauseGame() {
        gamePause = !gamePause;

        if(gamePause) {
            pauseButton.classList.remove("pause__button");
            pauseButton.classList.add("play__button");
        } else {
            pauseButton.classList.remove("play__button");
            pauseButton.classList.add("pause__button");
        }
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

mainMenuControl();