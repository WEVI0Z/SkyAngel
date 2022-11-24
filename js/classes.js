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

    update() {
        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(KEYS.d.pressed && this.velocity.x <= 5) {
            this.velocity.x += 1;
        } else if(this.velocity.x > 0) {
            this.velocity.x -= 1;
        }
        if(KEYS.a.pressed && this.velocity.x >= -5) {
            this.velocity.x -= 1;
        } else if(this.velocity.x < 0) {
            this.velocity.x += 1;
        }
        if(KEYS.s.pressed && this.velocity.y <= 5) {
            this.velocity.y += 1;
        } else if(this.velocity.y > 0) {
            this.velocity.y -= 1;
        }
        if(KEYS.w.pressed && this.velocity.y >= -5) {
            this.velocity.y -= 1;
        } else if(this.velocity.y < 0) {
            this.velocity.y += 1;
        }
    }
}