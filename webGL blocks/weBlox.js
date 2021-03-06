let adam;
let blox = [];

let me;

let prevX = 0;
let prevY = 0;

let rad = Math.PI/180;

// Update count, for smaller increment than frameCount.
let upD = 0.00001;

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    setupSun();
    setupBlox();
    
    me = new Subject();
    
    let aPos = createVector(0,10,0);
    adam = new Blox(aPos, 10);
    
    mouseX = 0;
    mouseY = 0;

    //translate(0,0,700);
    
}

function setupSun(){
    let v = createVector(32,-100,1);
    v.normalize();
    directionalLight(255,255,0,v.x,v.y,v.z);
}

function setupBlox(){
    
    let rows = 44;
    let cols = 44;
	let blockSize = 10;
    let gap = blockSize * 4;	// Default = 4.
	
	noiseSeed(2020);
	
    for (let i = 0; i < rows ; i++){
        
        for (let j = 0; j < cols; j++){
            let aPos = createVector(i * gap, 70,-200 + j * gap);
            blox.push(new Blox(aPos, blockSize));
			tb = blox[blox.length-1];
			tb.pos.y +=
				noise(tb.pos.x/542,
					tb.pos.z/542) * 400;
        }
    }
}

function draw(){
    background(64);
    
    // Updates global translation and rotation.
    me.update();
    
    //upD += 0.000000001;
    
    //push();
    translate(me.pos.x,me.pos.y,me.pos.z);
    
    adam.render();
    adam.rot.y += 0.02;
    adam.rot.x += 0.01;
    
    
    for (let i = 0; i < blox.length; i++){
        blox[i].render();
        //blox[i].rot.y += 0.02;
        //blox[i].rot.x += 0.03;
        //let distV = createVector(blox[i].pos.x,
          //                       0,
            //                     0);
        //distV.sub(me.pos);
        //blox[i].pos.y = 242+ (62*Math.sin(distV.magSq()*upD));
    }
   
}


function mouseMoved(){
    if (mouseX < prevX)
        me.rot.y -= (prevX - mouseX);
    else if (mouseX > prevX)
        me.rot.y += (mouseX - prevX);
	
	if (mouseY < prevY)
        me.rot.x += (prevY - mouseY);
    else if (mouseY > prevY)
        me.rot.x -= (mouseY - prevY);
    
    prevX = mouseX;
    prevY = mouseY;
}

class Subject{
    constructor(){
        this.pos = createVector(0,0,0);
        this.vel = createVector(0,0,0);
        this.acc = createVector(0,0,0);
        
        this.rot = createVector(0,0,0);
    }
    
    checkInput(){
        if (keyIsDown(87)){
            this.pos.z += Math.cos(-radians(this.rot.y));
            this.pos.x += Math.sin(-radians(this.rot.y));
        }
        if (keyIsDown(83)){
            this.pos.z -= Math.cos(-radians(this.rot.y));
            this.pos.x -= Math.sin(-radians(this.rot.y));
        }
    }
    
    // Updates position of subject/user/player.
    update(){
        
        // Centre of view -- for correct rotations.
        translate(0, 0, 700);
        
        // Rotation.
        rotateY(radians(this.rot.y));
        //rotateX(-radians(this.rot.x));
        
        this.checkInput();
    }
}

class Blox{
    constructor(_pos, _scale){
        this.pos = createVector(_pos.x,
                                _pos.y,
                                _pos.z);
        this.rot = createVector(0,0,0);
        this.acc = createVector(0,0,0);
        this.vel = createVector(0,0,0);
        
        this.scale = _scale;
        this.fill = color(10,255,0);
    }
    
    render(){
        push();
            //translate(me.pos.x + this.pos.x,this.pos.y, me.pos.z + //this.pos.z);
        translate(this.pos.x,this.pos.y, this.pos.z);
            rotateX(this.rot.x);
            rotateY(radians(this.rot.y));
            rotateZ(this.rot.z);
            //fill(this.fill);
            ambientMaterial(this.fill);
            box(0,0,0, this.scale);
        pop();
    }
}