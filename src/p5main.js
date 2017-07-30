

class particle {

    constructor() {
        this.idx = 0.0;

        this.color = {r:0,g:0,b:0}

        this.velocity = {x:0, y:0};
        this.position = {x:0, y:0};
        this.scale = {x:0, y:0};

        this._position = {x:0, y:0}; 
        this._scale = {x:0, y:0};
    }

    setup(nowidx, maxidx) {
        this.idx = nowidx / maxidx;

        this.position.x = nowidx / maxidx * window.innerWidth;
        this.position.y = window.innerHeight * 0.5;
        
        this._position.x = nowidx / maxidx * window.innerWidth;
        this._position.y = window.innerHeight * 0.5;
        
        this.velocity.x = 100.0;
        this.velocity.y = 0.0;


        this.color.r = 255 * (0.5 + 0.5 * Math.random());
        this.color.g = 255 * (0.5 + 0.5 * Math.random());
        this.color.b = 255 * (0.5 + 0.5 * Math.random());

        this.scale.x = 10.0;
        this.scale.y = 10.0;

        this._scale.x = 10.0;
        this._scale.y = 10.0;
    }

    update(dt, fft) {

        //it have to do;
        this.position.x += this.velocity.x * dt;
        //this is custom logic 
        this.position.y = window.innerHeight * 0.5 + fft * Math.sin(this.idx * Math.PI * 2.0 + this.position.x / window.innerWidth * Math.PI * 2.0 );//this.velocity.y * dt;
        
        this.scale.x = this.scale.y = 0.2 + fft * 0.1;

        this._position.x += (this.position.x - this._position.x) * dt * 10.0;
        this._position.y += (this.position.y - this._position.y) * dt * 10.0;

        this._scale.x += (this.scale.x - this._scale.x) * dt;
        this._scale.y += (this.scale.x - this._scale.y) * dt;

        //if this particles is over window width, return to zero;
        if(this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
    }

    draw() {
        push();
        noStroke();
        translate(this._position.x, this._position.y);
        scale(this._scale.x, this._scale.y);
        fill(this.color.r, this.color.g, this.color.b);
        ellipse(0.0, 0.0, 1.0, 1.0);
        pop();
    }
}





var particles_count = 200;
var particles = [];

var nowt, oldt;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    
    p5sl.setup();
    
    nowt = millis() * 0.001;
    oldt = millis() * 0.001;

    //initialized sound track
    particles = [];
    for(var i = 0 ; i < particles_count ; i ++) {
        const p = new particle();
        p.setup(i, particles_count);
        particles.push(p);
    }

    //
}

function draw() {
    oldt = nowt;
    nowt = millis() * 0.001;

    p5sl.update();

    background(
        p5sl.fft[(Math.random() * 255) << 0], 
        p5sl.fft[(Math.random() * 255) << 0], 
        p5sl.fft[(Math.random() * 255) << 0], 10);
    for(var i = 0 ; i < particles_count ; i ++) {
        
        var rptidx = Math.abs(i / particles_count - 0.5) * 2.0;
        var fftidx = (rptidx * 255) << 0;

        particles[i].update(nowt - oldt, p5sl.fft[fftidx]);
        particles[i].draw();
    }
}