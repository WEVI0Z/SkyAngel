"use strict"

const PLANE_IMG_URL = "../img/airplane.png";
const CLOUDS_IMG_URLS = [
    "../img/cloud1.png",
    "../img/cloud2.png",
    "../img/cloud3.png"
];

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

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const plane = new Plane(
    {
        position: {
            x: 0,
            y: 0
        },
        imageSrc: PLANE_IMG_URL,
        scale: 0.15
    }
);

function contolKeys() {
    function keyDownHandler(event) {
        switch (event.key) {
            case "w":
                KEYS.w.pressed = true;
                break;
            case "a":
                KEYS.a.pressed = true;
                break
            case "s":
                KEYS.s.pressed = true;
                break;
            case "d":
                KEYS.d.pressed = true;
                break
        }
    }
    
    function keyUpHandler(event) {
        switch (event.key) {
            case "w":
                KEYS.w.pressed = false;
                break;
            case "a":
                KEYS.a.pressed = false;
                break
            case "s":
                KEYS.s.pressed = false;
                break;
            case "d":
                KEYS.d.pressed = false;
                break
        }
    }

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
}

function spawnCloud() {
    const cloudURL = CLOUDS_IMG_URLS[getRandomIndex(CLOUDS_IMG_URLS)];

    console.log(cloudURL);

    const cloud = new Entity({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: cloudURL,
        scale: 0.5
    });

    return cloud;
}

const cloud = spawnCloud();
const cloud3 = spawnCloud();
const cloud2 = spawnCloud();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "blue";
    c.fillRect(0, 0, canvas.width, canvas.height);

    plane.update();

    cloud.update();
    cloud2.update();
    cloud3.update();
}

animate();
contolKeys();