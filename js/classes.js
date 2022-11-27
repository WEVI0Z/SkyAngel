class Entity {
    constructor({position, imageSrc, scale = 1, framerate = 1, frameBuffer = 3}) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = () => {
            this.width = (this.image.width / this.framerate) * scale;
            this.height = this.image.height * scale;
        }
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0;
        this.framerate = framerate;
    }

    draw() {
        if(!this.image) {
            return;
        }

        const cropBox = {
            position: {
                x: this.currentFrame * (this.image.width / this.framerate),
                y: 0
            },
            width: this.image.width / this.framerate,
            height: this.image.height
        }

        c.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.draw();
    }
}

class Plane extends Entity{
    constructor({position, imageSrc, scale = 1}) {
        super({position, imageSrc, scale});
        this.velocity = {
            x: 0,
            y: 0
        };
    }

    checkBorders(leftBorder = 0, rightBorder = canvas.width, topBorder = 0, bottomBorder = canvas.height) {
        if(this.position.x <= leftBorder) {
            this.velocity.x = 1;
        } else if(this.position.x + this.width >= rightBorder) {
            this.velocity.x = -1;
        } else if(this.position.y <= topBorder) {
            this.velocity.y = 1;
        } else if(this.position.y + this.height >= bottomBorder) {
            this.velocity.y = -1;
        }
    }

    update() {
        this.draw();

        if(KEYS.d.pressed && this.velocity.x <= 10) {
            this.velocity.x += 1;
        } else if(this.velocity.x > 0) {
            this.velocity.x -= 1;
        }
        if(KEYS.a.pressed && this.velocity.x >= -10) {
            this.velocity.x -= 1;
        } else if(this.velocity.x < 0) {
            this.velocity.x += 1;
        }
        if(KEYS.s.pressed && this.velocity.y <= 10) {
            this.velocity.y += 1;
        } else if(this.velocity.y > 0) {
            this.velocity.y -= 1;
        }
        if(KEYS.w.pressed && this.velocity.y >= -10) {
            this.velocity.y -= 1;
        } else if(this.velocity.y < 0) {
            this.velocity.y += 1;
        }

        this.checkBorders();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Cloud extends Entity {
    constructor({scale = 1}) {
        const cloudURL = CLOUDS_IMG_URLS[getRandomIndex(CLOUDS_IMG_URLS)];

        const x = canvas.width / tilesMap.cols * getRandomIndex(tilesMap.tiles[0]);
        const y = canvas.height / tilesMap.rows * getRandomIndex(tilesMap.tiles);
    
        super({position: {
            x,
            y
        }, imageSrc: cloudURL, scale});

        this.speed = -2;
    }

    getRandomPosition() {
        this.position = {
            x: canvas.width / tilesMap.cols * getRandomIndex(tilesMap.tiles[0]) + canvas.width,
            y: canvas.height / tilesMap.rows * getRandomIndex(tilesMap.tiles)
        }
    }

    checkBorders(leftBorder = 0) {
        if(this.position.x <= leftBorder - this.width) {
            this.spawnCloud();
        }
    }

    spawnCloud() {
        this.getRandomPosition();
        for (let i = 0; i < tilesMap.rows; i++) {
            for (let j = 0; j < tilesMap.cols; j++) {
                if(this.tileCollision(i, j) && tilesMap.tiles[i][j] == 1) {
                    this.spawnCloud();
                }
            }
        }
    }

    tileCollision(i, j) {
        const x = canvas.width / tilesMap.cols * getRandomIndex(tilesMap.tiles[i]);
        const y = canvas.height / tilesMap.rows * getRandomIndex(tilesMap.tiles);

        return (
            this.position.x <= x + tilesMap.width + canvas.width &&
            this.position.x + this.width >= x + canvas.width &&
            this.position.y >= y - tilesMap.height &&
            this.position.y - this.height <= y
        );
    }

    updateCloudPositions() {
        for (let i = 0; i < tilesMap.rows; i++) {
            for (let j = 0; j < tilesMap.cols; j++) {
                if(this.tileCollision(i, j)) {
                    tilesMap.tiles[i][j] = 1;
                    // console.log(canvas.width, canvas.height);
                }
            }
        }
    }

    update() {
        this.draw();
        this.checkBorders();
        this.updateCloudPositions();

        this.position.x += this.speed;
    }
}

class TilesMap {
    constructor(width, height, rows, cols) {
        this.height = height / rows,
        this.width = width / cols,

        this.rows = rows,
        this.cols = cols,
        
        this.tiles = []

        for (let i = 0; i < rows; i++) {
            const temp = [];
            for (let j = 0; j < cols; j++) {
                temp.push(0);
            }
            this.tiles.push(temp);
        }
    }

    update() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.tiles[i][j] = 0;
            }
        }
    }
}