
/*

Pseudo-Hilbert Curve 
0.1

Following Daniel Shiffman's example:
https://www.youtube.com/watch?v=dSK-MW-zuAc

Sat 8th February 2020

*/

let order = 6;
let N = Math.pow(2, order);
let total = N * N;

let paths = [];

function setup(){
    
   createCanvas(400,400);
    
   background(random(0,255),
			  0,
			  random(0,255));
	
	text("Order = " + order +
		 "\nN = " + N +
		 "\nTotal = " + total,
		 width/2,42);
	
//	for (let i = 1; i <= N; i++){
//		hilbert(i);
//	}
	
	for (let i = 0; i < total; i++){
		paths[i] = hilbert(i);
		let len = width/N;
		paths[i].mult(len);
		paths[i].add(len/2,len/2);
	}

	stroke(255);
	strokeWeight(3);
	noFill();
	
	
}

let counter = 0;
function draw(){
	
	
	
	beginShape();
	
	//translate(width/2,height/2);
		
		for (let i = 0; i < counter; i++){
			stroke(255,10);
			strokeWeight(1);
			noFill();
			
			//rotate(0.005);
			
			vertex(	paths[i].x,
			  		paths[i].y);
//			fill(0);
//			text(i, paths[i].x,
//					paths[i].y)
//			noFill();
		}
	endShape();
	
	if (counter < paths.length)
	counter++;
	else counter = 0;
		
}

function hilbert(i){
	
	let points = [];
	
	points.push(createVector(0,0));
	points.push(createVector(0,1));
	points.push(createVector(1,1));
	points.push(createVector(1,0));
	
	
	// Binary me up.
	// (Bit masking).
	let index = i & 3;
	let v = points[index];
	
	for (let j = 1; j < order; j++){
	i = i >>> 2;
	index = i & 3;
	
	let len = pow(2,j);
		
	if (index == 0){
				let temp = v.x;
				v.x = v.y;
				v.y = temp;
	}
	else if (index == 1){
			 	v.y+=len;
			 }
	else if (index == 2){
			 	v.y+=len;
				v.x+=len;
			 }
	else if (index == 3){
		
				let temp = len-1-v.x;
				v.x = len-1-v.y;
				v.y = temp;
		
			 	v.x+=len;
				
	}
		
	} // End of j.
	
	return v;
	
}






