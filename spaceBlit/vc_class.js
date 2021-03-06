// Voxel cybernetics.

let prevX;
let prevY;

// For swipe controls.
// *** NB touchThrust now handled
// in editor's mousePressed()!!!!
let thrusting = false;
let touchThrust = false;
//function touchStarted(){
//    thrusting = true;
//    touchThrust = true;
//}
function touchEnded(){
    thrusting = false;
    touchThrust = false;
    
    if (gameMode===-1){
        someMusicLoaded();
    }
    
    if (gameMode===1){
    // Tapped engine block?
    let vM = createVector(  
        mouseX-width/2,
        mouseY-height/2);
    
    let dist = createVector();
       dist = p5.Vector.sub
       (vM,cybers[0].pos);
        
    if (dist.mag()
        < 20){
        gameMode=0;
    }
    }
}

class Cyber{
    constructor(x,y,z){
        this.pos = createVector(x,y,z);
        
        // Scale of voxels.
        this.sca = 14;
        
        // Rotation.
        // -90 because begin pointing up.
        this.rot = -90;
        
        // Array of voxels.
        this.voxs = [];
        
        // Ship factors.
        this.thrusting = true;
        this.shipSpeed = 1;
        this.shipAcc = 1.2;
        this.maxSpeed = 420;
        
        // Default begins with 
        //the 'base block' only.
        this.build(0);
    }
    
    input(){
        
        // For touch/mouse swipes...
        // Get distances.
        let vM = createVector(mouseX, mouseY);
        let vP = createVector(prevX, prevY);
        let dist = p5.Vector.dist(vM,vP);
        let distX = Math.abs(vM.x - vP.x);
        let distY = Math.abs(vM.y - vP.y);
        prevX = mouseX;
        prevY = mouseY;
        // Rotation based on left and right swipe.
        if (distY < distX){
            if (vM.x > vP.x) this.steer(1, distX);
            else this.steer(-1, distX);
        }

    
        // Rotation based on key-input.
    if (keyIsDown(68) ||
       keyIsDown(RIGHT_ARROW)){
        this.steer(1,5);
    }
    if (keyIsDown(65) ||
       keyIsDown(LEFT_ARROW)){
        this.steer(-1,5);
    }
    if (keyIsDown(87) ||
       keyIsDown(UP_ARROW) ||
       touchThrust){
        this.thrusting = true;
    }else this.thrusting = false;
    }
    
    steer(_p, _amount){
    
    // The latter half of this equation just
    // decreases steering amount with speed.
    this.rot+= (_p * _amount * 2)/
        (1+(this.shipSpeed)/100);
    
    }
    
    forward(_p){
        if (this.thrusting){
        this.shipSpeed += this.shipAcc;
        }
    
        // Speed regulation.
        if (this.shipSpeed > 
            this.maxSpeed)
            this.shipSpeed =this.maxSpeed;
    
        if (this.shipSpeed < 1)
        this.shipSpeed = 0;
        
        if (this.shipSpeed > 0){    
        //_p *= shipSpeed * 1/frameRate();
        _p *= this.shipSpeed *
            deltaTime;
    
        this.pos.x += _p *  Math.cos(radians(this.rot));
        this.pos.y += _p *  Math.sin(radians(this.rot));
     
        // Space friction :|
        this.shipSpeed *= 0.99;
        }

    }
    
    wrap(sectorSensitive){
        // Boundaries.
        let lB = 0 - width/2;
        let rB = width/2;
        let tB = 0 - height/2;
        let bB = height/2;
        
        // Adjust for field of view.
        // This is a hack.
        // Should definitely do something
        // more accurate for negatives,
        // and find accurate formula.
        let fOv = 1.04;
        if (this.pos.z > 0)
            fOv*=0;
        lB -= Math.abs(this.pos.z)*fOv;
        rB += Math.abs(this.pos.z)*fOv;
        tB -= Math.abs(this.pos.z)*fOv;
        bB += Math.abs(this.pos.z)*fOv;
        
    // Wrap ship.
    let newSector = false;
    // Dir 1up, 2down, 3left, 4right. 
    let dir = 0;
    if (this.pos.x < lB) {this.pos.x = rB;
                    dir = 3;
                          newSector = true;
                   }
    if (this.pos.x > rB) {this.pos.x = lB;
                    dir = 4;
                          newSector = true;
                   }
    if (this.pos.y < tB) {this.pos.y = bB;
                    dir = 1;
                    newSector = true;
                   }
    if (this.pos.y > bB) {this.pos.y = tB;
                    dir = 2;
                    newSector = true;
                   }
        
        
    // Create new starry layers with new sector?
    
    if (sectorSensitive && 
        newSector===true){
        // Initialize layers (to be rendered as images).
        lettherebeStars(0); // First star layer.
        lettherebeStars(2); // Second star layer. 
        
        // An event listener.
        // Switched to true at new
        // sector transition, then
        // false when new sector check.
        sectorTransition = true;
        
        // Update location.
        if (dir===1) sector.y--;
        if (dir===2) sector.y++;
        if (dir===3) sector.x--;
        if (dir===4) sector.x++;
        
        }
        
    }
    
    // Pass in an array of boxes.
    construct(boxes){
        // Clear array first.
        this.voxs = [];
        
        let b = boxes;
        
        // Engine block index.
        let eB = 0;
        
        // First, find engine block.
        for (let i=0;i<b.length;i++){
           if (b[i].e) {
               eB = i;
               break;
           }
        }
        
        // Instantiate engine block
        // first, at start of array.
        this.voxs[0] = new Voxel(0,0,0);
        
        // Iterate over array of
        // boxes, missing out e.
        // Look for populated boxes.
        for (let i=0;i<b.length;i++){
           if (!b[i].e && b[i].p) {
               
            // Find relative grid pos.   
            let x = b[i].gX - b[eB].gX;
            let y = b[i].gY - b[eB].gY;
            let z = 0;
            // Convert unit pos to scale.
            x*=this.sca;
            y*=this.sca;
            z*=this.sca;
               
            this.voxs.
            push(new Voxel(x,y,z));
               
           }
        }
        
        // Stain 'engine block' blue-
        // green.
        this.voxs[0].fill = color(0,250,250);
        
        // Apply Cyber's scale to voxels.
        this.applyScale();
        
    }
    
    // Set positions of constituent voxels.
    build(_mode){
        // Clear array first.
        this.voxs = [];

        if (_mode===0){
        // Default test (entire simple ship).
        // Base voxel. Back of ship.
        this.voxs[0] = 
            new Voxel(  0,
                        0,
                        0);
        // One forward.
        this.voxs[1] = 
            new Voxel(  0,
                        0-this.sca,
                        0);
        // Nose tip.
        this.voxs[2] = 
            new Voxel(  0,
                        0-(this.sca*2),
                        0);
        // Left wing.
        this.voxs[3] = 
            new Voxel(  0-this.sca,
                        0,
                        0);
        // Right wing.
        this.voxs[4] = 
            new Voxel(  0+this.sca,
                        0,
                        0);
        }
        
        // Randomized positions for cubes.
        else if (_mode===1){
            for (let i = 0; i < 
                 12;
                i++){
                let v = new Voxel(Math.floor(Math.random()*2*this.sca -
                                  1*this.sca),
                                 Math.floor(Math.random()*2*this.sca -
                                  1*this.sca),
                                 Math.floor(Math.random()*2*this.sca -
                                  1*this.sca));
                this.voxs.push(v);
            }
        }
        
        // Stain 'base block' blue-green.
        this.voxs[0].fill = color(0,250,250);
        
        // Apply Cyber's scale to voxels.
        this.applyScale();
    }
    
    applyScale(){
        // Applies scale of cyber to array of voxels.
       for (let i = 0; i < this.voxs.length; i++){
            this.voxs[i].sca = this.sca;
            this.voxs[i].applyScale();
        } 
    }
    
    render(_layer){
        
        _layer.push();
        
        // Position and rotation.
        _layer.translate(   this.pos.x,
                            this.pos.y,
                            this.pos.z);
        _layer.rotateZ(radians(this.rot+90));
        
        // Render array of voxels.
        // NB. rendering to same layer.
        for (let i = 0; i < this.voxs.length; i++){
            this.voxs[i].render(_layer);
        }
        
        _layer.pop();
    }
}


class Voxel{
    constructor(x,y,z){
        
        // Position, radius, and scale.
        this.pos = createVector(x,y,z);
        this.rad = createVector(1,1,1);
        this.sca = 1;
        
        // Fill style.
        this.fill = color(255);
        
        this.applyScale();
        
        // Rotation.
        // -90 because begin pointing up.
        this.rot = -90;
    }
    
    // Multiplies radius by current scale.
    applyScale(){
        this.rad.magnitude = 1;
        this.rad.mult(this.sca);
    }
    
    render(_layer){
        _layer.push();
            _layer.translate(   this.pos.x,
                                this.pos.y,
                                this.pos.z);
            _layer.rotateZ(radians(this.rot));
        
            _layer.ambientMaterial(this.fill);
        
        _layer.strokeWeight(3);
        _layer.stroke(0);
        
            _layer.box( this.rad.x,
                        this.rad.y,
                        this.rad.z);
        _layer.pop();
        
    }
}