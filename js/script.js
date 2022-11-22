"use strict"

const PLANE_IMG_URL = "../img/airplane.png";
const CLOUDS_URLS = [
    "../img/cloud1.png",
    "../img/cloud2.png",
    "../img/cloud3.png"
];

function startTheGame() {
    const playground = document.querySelector(".environment__playground");

    createPlaneEntity(playground);

    function setXCord(cord, entity) {
        entity.style.left = cord + "px";
    }
    
    function setYCord(cord, entity) {
        entity.style.bottom = cord - 38 + "px";
    }

    function spawnEntity(field, entity) {
        field.appendChild(entity)
    }

    function destroyEntity(entity) {
        entity.parentNode.removeChild(entity);
    }

    function createPlaneEntity(field) {
        const plane = document.createElement("div"); 
        plane.classList.add("plane");
        let xCord = 100;
        let yCord = 200;
        
        setXCord(xCord, plane);
        setYCord(yCord, plane);
        
        spawnEntity(field, plane)

        function keyPressInt(fn, cord, neg) {
            cord += 20 * neg;
            fn(cord, plane);
            console.log(cord)
            return cord;
        }
        
        function planeKeyControl(e) {
            if(e.code == "KeyW" && yCord <= 614-76) {
                yCord = setInterval(keyPressInt(setYCord, yCord, 1), 2000);
                // yCord += 20;
                // setYCord(yCord, plane);
            } else if(e.code == "KeyS" && yCord >= 20) {
                yCord -= 20;
                setYCord(yCord, plane);
            } else if(e.code == "KeyA" && xCord >= 10) {
                xCord -= 20;
                setXCord(xCord, plane);
            } else if(e.code == "KeyD" && xCord <= 1022 - 210) {
                xCord += 20;
                setXCord(xCord, plane);
            }
        }
        
        document.addEventListener('keydown', planeKeyControl);
    }
}

startTheGame();