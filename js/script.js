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

const CLOUDS_AMOUNT = 4;

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1022
canvas.height = 614;

function getMapTiles(width, height, rows, cols) {
    const tilesMap = {
        tileHeight: height / rows,
        tileWidth: width / cols,
        tilesRows: rows,
        tilesCols: cols,
        tiles: []
    };

    for (let i = 0; i < rows; i++) {
        const temp = [];
        for (let j = 0; j < cols; j++) {
            temp.push(0);
        }
        tilesMap.tiles.push(temp);
    }

    return tilesMap;
}

const tilesMap = new TilesMap(canvas.width, canvas.height, 3, 3);

function drawTiles() {
}

const plane = new Plane(
    {
        position: {
            x: 0,
            y: 0
        },
        imageSrc: PLANE_IMG_URL,
        scale: 0.5
    }
);

const clouds = [];

for (let i = 0; i < CLOUDS_AMOUNT; i++) {
    clouds.push(new Cloud(
        {
            scale: 3
        }
    ));
}

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
    }
    
    function keyUpHandler(event) {
        keyCheck(event.key, false);
    }

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
}

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "blue";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    tilesMap.update();

    clouds.forEach(cloud => {
        cloud.update();
    });

    plane.update();

    drawTiles();
    for(let i = 0; i < tilesMap.tiles.length; i++) {
        for(let j = 0; j < tilesMap.tiles[i].length; j++) {
            c.fillStyle = "red";
            const x = canvas.width / tilesMap.cols * j;
            const y = canvas.height / tilesMap.rows * i;
            c.fillRect(x, y, 10, 10);
        }
    }
}

animate();
contolKeys();