// Infinite 2D terrain using Perlin noise.

// Each 'gStalk' will need to keep a track of two things:
// who its neighbour(s) are. Oh, and colour, etc.

// Additionally, then, we need a 'manager', whose job will simply enough be to keep a track of which two gStalks are the current 'edge stalks' -- left and right (negative and positive).

// Width of each individual stalk.
class GSterrain{
    constructor(_width){
        // Constructor will have to
        // create then store how many
        // gStalks needed to fit across
        // the designated 'span'.
        // Only then can it grab the
        // right-most or 'positive' edge stalk.
        // 'Negative' edge stalk will of course
        // be first edge stalk in array.
        // NB. should only grab the index, not the
        // stalk object itself :)
        
        this.width = _width;    // Width of each gStalk.
        this.height = height*2; // Height of each gStalk.
        this.xBegin = 0 - _width;  // Where to start span. 
        this.yPos = height*3;      // Y position.
        
//        this.seed = 9;
//        this.amplitude = height*3;
//        this.resolution = height;
        this.seed = 9;
        this.amplitude = height*5;
        this.resolution = height*5;
        
        this.span = width + _width * 2;
        
        this.gStalks = [];      // Array of gStalks.
        
        this.lEdge = null;
        this.rEdge = null;
        
        // Generate terrain, which will include
        // populating the gStalks arrary as well as
        // determinging lEdge and rEdge.
        this.genTerrain();
        
    }
    
    renderTerrain(){
        for (let i = 0; i < this.gStalks.length; i++){
            this.gStalks[i].render();
        }
    }
    
    // Bool moving right?
    moveTerrain(_goingRight){
        if (_goingRight){
            console.log("Rainbows glimmer.");
            // Current right edge gets new neighbour (r).
            // New right edge gets new neighbour (l).
            this.gStalks[this.rEdge].Rneighbour =
            this.lEdge;
            this.gStalks[this.lEdge].Lneighbour =
            this.rEdge;
            // Right edge is now, then, current left edge.
            this.rEdge = this.lEdge;
            this.gStalks[this.lEdge].moveMe
            ('right');
            // Left edge index is now current left edge's
            // right neighbour (which is just its index).
            // Will this cause self-referential prob?
            // To fix, just use a third term.
            this.lEdge =
            this.gStalks[this.lEdge].Rneighbour;
        }
        else if (!_goingRight){
            console.log("Unicorns are fancy.");
            // Current right edge gets new neighbour (l).
            // New left edge gets new neighbour (r).
            this.gStalks[this.lEdge].Lneighbour =
            this.rEdge;
            this.gStalks[this.rEdge].Rneighbour =
            this.lEdge;
            // Left edge will become current right edge.
            this.lEdge = this.rEdge;
            this.gStalks[this.lEdge].moveMe
            ('left');
            // Right edge index is now current right edge's
            // left neighbour (which is just its index).
            this.rEdge =
            this.gStalks[this.rEdge].Lneighbour;
        }
        
    }
    
    // Generate new terrain.
    genTerrain(){
    
        // Individual stalk width.
        // We use this here so as to be able
        // to be variable at a later stage...
        let thisWidth = this.width;
        
        let totalW = 0; // Total width so far.

        noiseSeed(this.seed);
    
        for (let i = 0; totalW <= this.span; i++){
        
        let xOffset = this.xBegin + totalW - thisWidth/2;
        
        let noiseF = noise(xOffset/this.resolution)
        *this.amplitude;
        
        // Spawn a new stalk body with matter.js.
        RedHen_2DPhysics.newObj
        ('GhostRectangle', xOffset, 
         this.yPos + noiseF/2 - this.amplitude/2, 
         thisWidth, this.height);
            RedHen_2DPhysics.lastObjectCreated().OSR = false;
            RedHen_2DPhysics.lastObjectCreated().
        makeStatic();
        // ...and grab this body.
        // Note here that we are for the
        // first time populating this array.
        this.gStalks. 
            push(new Gstalk(i, this));
        
        totalW += thisWidth;  
    }   // End of for loop.
        
        // So, now we can find our 'edge stalks'.
        // Well, rEdge the only mystery.
        this.lEdge = 0;
        this.rEdge = this.gStalks.length-1;
    }
    
}   // End of GSterrain object.

class Gstalk{
    constructor(_index, _parent){
        
        // These are just indeces, not
        // the objects themselves!
        this.Lneighbour = _index -1;
        this.Rneighbour = _index +1;
        
        this.index = _index;
        this.parent = _parent;
        
        this.fill = color(0,Math.random()*100+42,0);
        
        this.myBody = 
        RedHen_2DPhysics.lastObjectCreated();
    }
    
    render(){
        
        push();
        fill(this.fill);
        noStroke();
        //stroke(color(255,42));
        
        translate(  this.myBody.bod.position.x,
                    this.myBody.bod.position.y);
        
        // Main stalk green body.
        rect(0,0,   this.myBody.width,
                    this.myBody.height);
        
        // Pattern of 'boxes'.
        let nOb = this.myBody.height/this.myBody.width;
        for (let i = 0; i < nOb/2; i++){
            
            fill(0,i*12+100,0);
            if (i%2===0)
            stroke(255,100);
            else stroke(0);
            
            rect(0,-((nOb/2)*this.myBody.width) + 
            this.myBody.width*i+this.myBody.width/2,
                                this.myBody.width,
                                this.myBody.width); 
        }
        
        
        pop();
    }
    
    moveMe(_leftORright){
        
        if (_leftORright === 'right'){
            // Calculate noise here.
            
            let xOffset = this.parent.gStalks[
                    this.parent.gStalks[
                    this.parent.rEdge].Lneighbour].
            myBody.bod.position.x + 
                this.parent.gStalks[
                    this.parent.rEdge].
            myBody.width/2;
            
            let noiseF = noise(
                xOffset
                /this.parent.resolution)
                *this.parent.amplitude;
            
        this.myBody.makePosition(
            xOffset + this.parent.gStalks[
                    this.parent.rEdge].
            myBody.width/2, 
            this.parent.yPos + noiseF/2 - 
            this.parent.amplitude/2); 
            
            
            
        }
        else if (_leftORright === 'left'){
            //this.myBody.makePosition(_x, _y);
            console.log("Can't be doing anything yet like.");
            
             let xOffset = this.parent.gStalks[
                    this.parent.gStalks[
                    this.parent.lEdge].Rneighbour].
            myBody.bod.position.x - 
                this.parent.gStalks[
                    this.parent.lEdge].
            myBody.width/2;
            
            let noiseF = noise(
                xOffset
                /this.parent.resolution)
                *this.parent.amplitude;
        
        this.myBody.makePosition(
            xOffset - this.parent.gStalks[
                    this.parent.lEdge].
            myBody.width/2, 
            this.parent.yPos + noiseF/2 - 
            this.parent.amplitude/2); 
            
        }
    }
}

