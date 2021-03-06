
let step = 1;
let displayNodes = false;

function setup(){
    createCanvas(400,400);
    background(200,0,200);
 
    setupMorph();
}

function draw(){
    background(200,0,200);
    
    //morph.rotation+=0.1;
    morph.renderEs();
    morph.render();
    
}

function mousePressed(){
    displayNodes = !displayNodes;
}

function mouseMoved(){
    morph.interpolate(step+=1);
}

function setupMorph(){
    morph = new Morph();
}

class Morph{
    constructor(){
        this.pos = createVector(width/2, height/2);
        
        // cTt = circle to triangle.
        this.transition = 'cTt';
        
        this.radius = 200;
        // width/2.5;
        
        this.nodeNum = 40;
        
        this.rotation = -90;
        
        this.edges = 3;
        
        this.nodes = [];
        this.setupNodes();
    }
    
    setupNodes(){
        
        // Populate the nodes array.
        for (let i = 0; i < this.nodeNum; i++){ 
            this.nodes.push(new Node(this, i));
        }
        
        // First, for the triangle at least,
        // we need to divide thinking into 3.
        let angleScalar = 360/this.nodeNum;
        for (let i = 0; i < this.nodeNum; i++){
            angleScalar = 360/this.nodeNum;
            this.nodes[i].pos.x =
            this.radius * Math.cos(radians(i*angleScalar));
            this.nodes[i].pos.y =
            this.radius * Math.sin(radians(i*angleScalar));
            
            // Identity.
            this.nodes[i].idPos.x = this.nodes[i].pos.x;
            this.nodes[i].idPos.y = this.nodes[i].pos.y; 
        
            // Triangle.
            let y = a*x +b; // cartesian coords.
            let x = b/(Math.sqrt(1+(a*a))*Math.sin(i-Math.atan(a)));// polar representation.
            
            
            
            
//            angleScalar *= this.nodeNum/this.edges;
//            this.nodes[i].esPos.x = this.radius *
//            Math.cos(radians(angleScalar*i));
//            this.nodes[i].esPos.y = this.radius *
//            Math.sin(radians(angleScalar*i));

           
//            if (i ===0){
//                this.nodes[i].esPos.x = this.radius;
//                this.nodes[i].esPos.y = 0;
//            }
//            if (i > 0 && i < this.nodeNum/3){
//                this.nodes[i].esPos.x = 
//                this.nodes[i-1].esPos.x -
//                i*2/angleScalar*this.radius/10;
//                this.nodes[i].esPos.y = 
//                this.nodes[i-1].esPos.y +
//                i*1/angleScalar*this.radius/10;
//            }
//            if (i >= this.nodeNum/3 && i < this.nodeNum/3 + this.nodeNum/3){
//                this.nodes[i].esPos.x = 
//                this.nodes[i-1].esPos.x;
//                this.nodes[i].esPos.y = 
//                this.nodes[i-1].esPos.y-i/angleScalar*this.radius/14;
//            }
//            if (i >= this.nodeNum/3 + this.nodeNum/3 && i < this.nodeNum){
//               this.nodes[i].esPos.x = 
//                this.nodes[i-1].esPos.x +
//                ((i)*this.radius/180);
//                this.nodes[i].esPos.y = 
//                this.nodes[i-1].esPos.y +
//                ((i)*this.radius/180)*0.5;
//            }
//             if (i ===this.nodes.length-1){
//                this.nodes[i].esPos.x = this.radius;
//                this.nodes[i].esPos.y = 0;
//            }
           
    
        
        }
        
    }
    
    interpolate(_step){
        //this.nodes.splice(this.nodes.length/3,1);
        for (let i = this.nodeNum-1; i >= 0; i--){
            this.nodes[i].interpolate(_step);
            
        }
    }
    
    render(){
        push();

        translate(this.pos.x, this.pos.y);
        rotate(radians(this.rotation));
        
        fill(0,0,255);
        ellipse(0,0,12,12); // Centre point.
        
        // Now, join/use nodes.
        fill(255,100);
        stroke(255);
        beginShape(CLOSE);
            
        
//            for (let i = 0; i < this.nodeNum; i++){
//                curveVertex(this.nodes[i].pos.x,
//                            this.nodes[i].pos.y);
//            }
        
                for (let i = 0; i < this.nodes.length; i++){
                    vertex( this.nodes[i].pos.x,
                            this.nodes[i].pos.y);
                }
        
                vertex( this.nodes[0].pos.x,
                        this.nodes[0].pos.y);
        
        endShape();
        pop();
        
        push();
        translate(this.pos.x, this.pos.y);
         rotate(radians(-90));
        for (let i = 0; i < this.nodes.length; i++){
      
            stroke(0);
            fill(255);
            textSize(20);
            if (displayNodes)
            text(i, this.nodes[i].pos.x,
                    this.nodes[i].pos.y);
            
        }
        pop();
    }
    
    renderEs(){
        push();

        translate(this.pos.x, this.pos.y);
        rotate(radians(-90));
        
        // Now, join/use EsNodes.
        fill(100,200);
        stroke(0);
        beginShape(CLOSE);
            for (let i = 0; i < this.nodes.length; i++){
                    vertex( this.nodes[i].esPos.x,
                            this.nodes[i].esPos.y);
                }
        
                vertex( this.nodes[0].esPos.x,
                        this.nodes[0].esPos.y);
        
        endShape();
        
        
        
        pop();
        
        
       push();
        translate(this.pos.x, this.pos.y);
         rotate(radians(-90));
        for (let i = 0; i < this.nodes.length; i++){
      
            stroke(0);
            fill(255);
            textSize(20);
            if (displayNodes)
            text(i, this.nodes[i].esPos.x,
                    this.nodes[i].esPos.y);
            
        }
        pop();
    } 
    
   
    
    
}

class Node{
    constructor(_parent, _index){
        this.pos = createVector(0,0);
        this.idPos = createVector(0,0);
        this.esPos = createVector(0,0);
        this.parent = _parent;
        this.index = _index;
    }

    
    interpolate(_step){
        // Find unit vector.
        let uV = createVector();
           uV= p5.Vector.sub(   this.esPos,this.pos);
        
        uV = uV.mult(0.01);
        
        this.pos = 
        p5.Vector.add(this.pos, uV);
    }
    
}