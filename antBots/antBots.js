// Physics bodies array.
var pA = [];
var p;

// The larger circle.
var wrecka;
// Voice of the larger circle.
var wVox;

var antz = [];
var gravity;
var hopForce;

function setup() {
  
    canvas = createCanvas(windowWidth,windowHeight);
    background(255);
    
    // Euler integration 'gravity'.
    gravity = createVector(0, 3);
    hopForce = createVector(0,-1);
    
    // Setup matter.js physics engine.
    setupMatter();
    setupMouseConstraint();
    renderMouseConstraint();
    // Change matter.js gravity.
    setGravity(0, 0.3); 
    
    noiseSeed(221188);
    // Create 222 physics bodies.
    // Randomly assign as static, dynamic, square or round.
    for (var i = 0; i < 99; i++){
        let type = 0;
        //type = Math.floor(Math.random()*3) + 1;
        type = 1;   // Static ball.
        
       // pA.push(new Pa2D((i*10)+100, 220+noise(i)*32, 10, 10*0.618,type));
        pA.push(new Pa2D((width/2)+(4+i)*Math.cos(i), (height/2)+(4+i)*Math.sin(i), 8,8,type));
    }
    
    // Window bounds.
    bottomW = new Ledge(width/2, height, width, 100);
    topW = new Ledge(width/2, 0, width, 100);
    leftW = new Ledge(0, height/2, 100, height);
    rightW = new Ledge(width, height/2, 100, height);


    // Begin with 22 blinkies.
    for (let i = 0; i < 22; i++){
        //let antScale = Math.random()*7;
        let antScale = 0.6;
        antz.push(new antBot(true,  Math.random()*width,
                                    Math.random()*height,
                                    antScale));
    }
    
    // A type '2', which means dynamic ball.
    wrecka = new Pa2D(200,height-100,40, 40,2); 

   // wVox = setupOscillator();
}


// This needs refactoring...
function PlaceBubl(mX,mY,mS){
    // We have a maximum of 222 bodies available.
    if (pA.length < 222)  pA.push(new Pa2D(mX,mY,random(1,mS),2));
    else{
            Matter.World.remove(myWorld, pA[0].bod);
            pA.splice(0,1);
            pA.push(new Pa2D(mX,mY,random(1,mS),2))
        } 
}

function mouseDragged(){
    //PlaceBubl(mouseX,mouseY,24);
}

// Checks for keyIsDown.
function keyInput(){
    if (keyIsDown(UP_ARROW)) setGravity(0,-1);
    if (keyIsDown(DOWN_ARROW)) setGravity(0,1);
    if (keyIsDown(RIGHT_ARROW)) setGravity(1,0);
    if (keyIsDown(LEFT_ARROW)) setGravity(-1,0);
    
    // Space-bar to...go to space (no gravity).
    if (keyIsDown(32)) setGravity(0,0);
    // 'G' for gravity.
    if (keyIsDown(71)) setGravity(0,1);
}

function keyTyped(){
    // Physics antBot.
    if (key==='p')
    antz.push(new antBot(true, mouseX, mouseY, 0.3));
    // Euler antBot.
    if (key==='e')
    antz.push(new antBot(false, mouseX, mouseY,1));
    
    if (key==='='){
        let oS = antz[0].scale;
        antz[0].scale++;
        antz[0].applyScale();
        antz[0].myBod.makeScale(antz[0].scale/oS);
    }
    
    if (key==='-'){
        let oS = antz[0].scale;
        antz[0].scale--;
        antz[0].applyScale();
        antz[0].myBod.makeScale(antz[0].scale/oS);
    }
    
}
   
function doSound(){
    changeFreq(wVox, wrecka.bod.speed*10);
}

function draw() {
    background(200);
    
    // Check for any keys held down.
    keyInput();
    
    // Matter.Engine.update(myEngine);
    
    drawWalls();
    
    // Render bodies.
    wrecka.render();
    for (var i = 0; i < pA.length; i++){
//        let vecX = pA[i].bod.position.x;
//        let vecY = pA[i].bod.position.y;
//        let cO = createVector(width/2, height/2);
//        let rV = p5.Vector.sub(cO, pA[i].bod.position);
//        let rVm = rV.mag();
//        let nX = cO.x + rVm * Math.cos(frameCount/200);
//        let nY = cO.y + rVm * Math.sin(frameCount/200);
//        pA[i].makePosition(nX, nY);
        pA[i].render();
    }
    
    
    // Oscillator that tracks speed of wrecka.
   // doSound();
    
    updateAnts();
    
    //renderMouseConstraint();

}

function drawWalls(){
    topW.render();
    bottomW.render();
    leftW.render();
    rightW.render();
}

function updateAnts(){
    for (let i = 0; i < antz.length; i++){
        antz[i].render();
        
        // Decide which physics and rendering each antBot will use.
        if (antz[i].hasBod){
            // Go matter.js!
            antz[i].screenTrap();
            if (Math.random() * 100 > 99) {
                antz[i].moveForward();
               
                antz[i].myBod.addForce(antz[i].hopForce);
                //antz[i].myBod.bod.torque = createVector(0,0);
            }
        }
        else { 
            // Go Euler!
            antz[i].update();
            //antz[i].screenWrap();
            let grounded = antz[i].checkGround(height-42);
            if (!grounded) antz[i].acc.add(gravity);
            else if (Math.random()*100>99) antz[i].acc.add(0,-10*antz[i].scale);
             }
    }
}

//*&*&*&*&*&*&*&
//&*&*&*&*&*&*&*
//*&*&*&&&*&*&*&