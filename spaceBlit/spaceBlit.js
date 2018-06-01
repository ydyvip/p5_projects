p5.disableFriendlyErrors = true;

let shipX = 0;
let shipY = 0;
let shipR = -90;
let shipSpeed = 1;
let maxSpeed = 420;

let canvas;

let music = [];
let currentMusic = 0;





function preload(){
     //setupMusic();
}

function setup(){
    
    canvas = createCanvas(windowWidth, windowHeight);
    background(0,29,0);
    
    // Initialize layers (to be rendered as images).
    lettherebeStars(0); // First star layer.
    lettherebeStars(2); // Second star layer.
    
    lettherebePlanets(0); // Planet layer.
    renderShip(0);        // Ship layer.
    
    mouseX = width/2;
    mouseY = height/2;
    
    shipX = width/2;
    shipY = height/2;
    
    prevX = mouseX;
    prevY = mouseY;
    
    voxTest();
     
}

let cybers = [];
function voxTest(){
//    for (let i = 0; i < 32; i++){
//        let v = new Voxel(  Math.random()*500-250,
//                            Math.random()*500-250,
//                            0);
//        voxs.push(v);
//    }
    
    for (let i = 0; i < 32; i++){
        let c = new Cyber(Math.random()
                          *(width/2)-(width/4),
                          Math.random()
                          *(height/2)-(height/4),
                          0);
        cybers.push(c);
    }
    
}

function shipForward(_p){
    
    input();
    
    if (thrusting){
        shipSpeed += 12;
    }
    
    // Speed regulation.
    if (shipSpeed > maxSpeed) 
        shipSpeed = maxSpeed;
    
    //_p *= shipSpeed * 1/frameRate();
    _p *= shipSpeed * deltaTime;
    
    shipX += _p * Math.cos(radians(shipR));
    shipY += _p * Math.sin(radians(shipR));
     
    // Space friction :|
    shipSpeed *= 0.99;
    
//    let zScalar = lerp(sSize,
//            map(shipSpeed,0,maxSpeed/1000,100,-100),
//                    0.1);
    
    // Wrap ship.
    let newSector = false;
    if (shipX < 0) {shipX = width;
                    newSector = true;
                   }
    if (shipX > width) {shipX = 0;
                    newSector = true;
                   }
    if (shipY < 0) {shipY = height;
                    newSector = true;
                   }
    if (shipY > height) {shipY = 0;
                    newSector = true;
                   }
    
    // Create new starry layers with new sector?
    //newSector = false;
    if (newSector===true){
        // Initialize layers (to be rendered as images).
        lettherebeStars(0); // First star layer.
        lettherebeStars(2); // Second star layer.   
    }
//    if (shipX < 0 - zScalar) shipX = width + zScalar;
//    if (shipX > width + zScalar) shipX = 0 - zScalar;
//    if (shipY < 0 - zScalar) shipY = height + zScalar;
//    if (shipY > height + zScalar) shipY = 0 - zScalar;
    
    
    
}

function shipSteer(_p, _amount){
    
    // The latter half of this equation just
    // decreases steering amount with speed.
    
    shipR+= (_p * _amount * 2)/(1+(shipSpeed)/100);
    
}

let thrusting = false;
let touchThrust = false;
function touchStarted(){
    thrusting = true;
    touchThrust = true;
}

function touchEnded(){
    thrusting = false;
    touchThrust = false;
}

function input(){
    
    // Get distances.
    let vM = createVector(mouseX, mouseY);
    let vP = createVector(prevX, prevY);
    
    let dist = p5.Vector.dist(vM,vP);
    let distX = Math.abs(vM.x - vP.x);
    let distY = Math.abs(vM.y - vP.y);
    
    // Mumma don't take no cheap moves.
//    if (dist < 0.1){
//        prevX = mouseX;
//        prevY = mouseY;
//        return;
//    }
    
    // Rotation based on key-input.
    if (keyIsDown(68) ||
       keyIsDown(RIGHT_ARROW)){
        shipSteer(1,5);
    }
    if (keyIsDown(65) ||
       keyIsDown(LEFT_ARROW)){
        shipSteer(-1,5);
    }
    if (keyIsDown(87) ||
       keyIsDown(UP_ARROW) ||
       touchThrust){
        thrusting = true;
    }else thrusting = false;
    
    // Rotation based on left and right swipe.
    // Thrust based on up and down swipe.
    if (distY < distX){
    if (vM.x > vP.x) shipSteer(1, distX);
    else shipSteer(-1, distX);
    }
//    else if (distY > distX){
//    if (vM.y > vP.y) shipSteer(1, distY);
//    else shipSteer(-1, distY);
//    }
    
    prevX = mouseX;
    prevY = mouseY;
    
}

function setupMusic(){
    music[0] = loadSound("https://redhendev.github.io/InfinitePacman/sound/song17.mp3");
    music[1] = loadSound("media/rMt.ogg");
    music[2] = loadSound("media/icyRealm.mp3");
    music[3] = loadSound("media/sirensInDarkness.mp3");
    
    currentMusic = 
            music[Math.floor(Math.random()*
                             music.length)];
}
function musicSystem(){
    // Music loop.
    if (!currentMusic.isPlaying()){
        currentMusic = 
            music[Math.floor(Math.random()*
                             music.length)];
        currentMusic.play();
        //currentMusic.rate(2);
        currentMusic.setVolume(1);
        if (currentMusic !== music[1])
            currentMusic.setVolume(0.05);
    }
}

let deltaTime = 0;
function draw(){
    
    // What's our deltaTime?
    // For consistent speed across devices.
    deltaTime = 1/(window.performance.now() - canvas._pInst._lastFrameTime);
    
    //musicSystem();
    
    // Greeeny space.
    //background(0,29,0);
    // Alpha trail.
    //background(0,9,0,64);
    background(0,9,0);
    
    // Twinkles.
    if (frameCount % 64 === 0){
    stroke(212);
    strokeWeight(10);
    point(  Math.random()*width,
            Math.random()*height);
    stroke(0,0,212);
    strokeWeight(5);
    point(  Math.random()*width,
            Math.random()*height);
    }
    
    // Always moving.
    shipForward(1);
    
    // Bottom starry layer.
    lettherebeStars(3);
    
    // Planet layer (WEBGL).
    lettherebePlanets(1);
    
    // Player's ship.
    renderShip(1);
    // Test array of Cyber craft.
    cybers[0].input();
    for (let i = 0; i < cybers.length; i++){
        cybers[i].forward(1);
        cybers[i].render(sop);
        
    }       
    // Render to main canvas as image.
    image(sop,0,0);
    
    // Top starry layer.
    lettherebeStars(1);
}

let sSize = 9;
function renderShip(_state){
    if (_state === 0){
        sop = createGraphics(width,height, WEBGL);
    }
    
    if (_state === 1){
        // Size of ship.
        sSize = lerp(sSize,
            map(shipSpeed,0,maxSpeed,22,0.1,true),
                    0.1);
        //let sSize = 9;
        
        sop.pointLight(255,255,255,
                      0, 0,87);
        
        // Clear background (clear alpha).
        sop.background(255,0);
        sop.push();
       
        sop.translate(shipX-width/2,shipY-height/2,
                     0);
        sop.rotateZ(radians(shipR+90));
        
        // Smoke balls.
        sop.push();
            sop.noStroke();
            //sop.fill(255,255,0,100);
            //sop.specularMaterial(255,255,0);
            sop.specularMaterial(0,255,255);
            for (let i = 0; i < 10; i++){
                sop.push();
            sop.translate(Math.random()*
                          (100-50)/(shipSpeed+1),
                         sSize/2+Math.random()*
                          (shipSpeed+1),
                         Math.random()*
                          sSize/4);
//            sop.sphere(Math.random()*
//                       map(shipSpeed,0,maxSpeed,
//                                sSize/2,20,true));
                let bSize = Math.random()*
                       map(shipSpeed,0,maxSpeed,
                                sSize/2,20,true);
                sop.box(bSize,bSize*3,bSize);
                sop.pop();
            }
        sop.pop();
        
        // Aesthetics.
        sop.stroke(0);
        sop.strokeWeight(2);
        //sop.fill(250);
        sop.specularMaterial(250);
        
        sop.box(sSize,sSize,sSize);
        sop.translate(sSize+2,
                      0);
        sop.box(sSize,sSize,sSize);
        sop.translate(-sSize*2-4,
                      0);
        sop.box(sSize,sSize,sSize);
        sop.translate(sSize+2,
                      -sSize-2);
        sop.box(sSize,sSize,sSize);
        sop.translate(0,
                      -sSize-2);
        sop.box(sSize,sSize,sSize);
        sop.pop();
//        // Render to main canvas as image.
//        image(sop,0,0);
    }
}

// First, we want to be able to create the 'stars' by creating a procedural texture.
// Next, 'volcanic debris' --> a fragmented remnant of the Singularity. Or something.
let foh;
let foh2;
let sop;
let fop;
function lettherebeStars(_state){
    // Initialize.
    // Black spots, semi-transparent.
    if (_state === 0){
        
    
        foh = createGraphics(width,height);
        
        let fohX = 0;
        let fohY = 0;
        for (let i = 0; i < 3; i++){
            foh.strokeWeight(Math.random()*32);
            
            fohX = Math.random()*width;
            fohY = Math.random()*height;
            
            // Yellow spots.
            foh.stroke(255,255,0,240);
            foh.point(  fohX,
                        fohY);
            
            // Black holes.
            foh.stroke(0,142);
            foh.point(  fohX+9,
                        fohY);
        }
        
        return;
    }
    
    // Initialize second.
    if (_state === 2){
        foh2 = createGraphics(width,height);
        //foh.background(200,0,100);
        
        for (let i = 0; i < 212; i++){
            foh2.strokeWeight(Math.random()*3);
            //foh2.stroke(99,0,255);
            foh2.stroke(0,255,0);
            foh2.point(  Math.random()*width,
                         Math.random()*height);
        }
        for (let i = 0; i < 512; i++){
            foh2.strokeWeight(Math.random()*3);
            //foh2.stroke(99,0,255);
            foh2.stroke(255);
            foh2.point(  Math.random()*width,
                         Math.random()*height);
        }
        
        return;
    }
    
    // Render FIRST to canvas.
    if (_state === 1){
        image(foh,0,0);
        return;
    }
    // Render SECOND to canvas.
    if (_state === 3){
        image(foh2,0,0);
        return;
    }
    
}

function lettherebePlanets(_state){
    if (_state === 0){
        fop = createGraphics(width,height, WEBGL);
    }
    
    if (_state === 1){
        // Size of ship.
        //let sSize = map(mouseY, 0,height,14,100);
        let pSize = 32;
        
        // Light source from top-left.
        fop.pointLight(255,255,255,
                      -100, -100,142);
        
        // Clear background (no alpha).
        fop.background(0,0);
        
        fop.push();
        
        fop.translate(0,0,sSize*9);
        
        // Orbital pool.
        fop.push();
            fop.translate(122,-88);
            fop.rotateY(radians(-32));
            fop.rotateZ(frameCount/512);
            fop.stroke(242);
            fop.strokeWeight(7);
            fop.fill(80,80,255,172);
            //fop.noStroke();
            fop.ellipse(0,0,172);
        fop.pop();
        
        fop.fill(0);
        fop.noStroke();
        fop.ambientMaterial(200);
        fop.translate(122,
                     -88);
        
        //fop.rotateZ(-frameCount/200);
        fop.rotateX(-frameCount/200);
        fop.sphere(pSize);
        
        // Moon.
        fop.translate(0,
                     -120);
        fop.ambientMaterial(112,112,0);
        fop.sphere(pSize/2);
        
        // Baby moon.
        fop.rotateX(frameCount/100);
        fop.translate(0,
                     224);
        fop.ambientMaterial(122,122,0);
        fop.sphere(pSize/4);
        
        fop.pop();
        // Render to main canvas as image.
        image(fop,0,0);
    }
}

