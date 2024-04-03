const canvas = document.querySelector(`canvas`);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const webgl = canvas.getContext(`webgl`);
	
let redsquare= createmat4(); //models/objects
let whitesquare = createmat4();
let bluesquare = createmat4();
let purplesquare = createmat4();
let pacman = createmat4();
let view = createmat4();
let projection = createmat4();  
perspective(projection, 120 * Math.PI/180,  canvas.width/canvas.height, 2, 20 ); 
let pacmanvertices = circle(0.25,8);
let a = [1,1,1];
let b = [1,-1,1];
let c = [-1,-1,1];
let d = [-1,1,1];
let e = [1,1,-1];
let f = [1,-1,-1];
let g = [-1,-1,-1];
let h = [-1,1,-1];  
  
let box = [
  a,b,c, a,c,d, e,f,g, e,g,h, //front & back
  a,e,h, a,d,h, b,f,g, b,c,g, //top & bottom
  a,b,f, a,e,f, d,c,g, d,h,g  //left & right
].flat();
//flat() turns a multi D array to 1D

let squares = [a,b,c, a,c,d].flat();
let vertarray = [...squares, ...pacmanvertices]; 
  /*     or               
let vertarray = squares.concat(pacman)*/
//add pacman vertices to the end of square vertices

let rd =   [1,0,0,1]; //red
let gr =   [0,1,0,1]; //green
let bl =   [0,0,1,1]; //blue
let yl =   [1,1,0,1]; //yellow
let pl =   [1,0,1,1]; //purple
let cy =   [0,1,1,1]; //cyan
let gry =  [0.5,0.5,0.5,1];//grey
let wh =   [1,1,1,1]; //white

let vertices = new Float32Array(vertarray);   
const buffer = webgl.createBuffer(); 
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices,webgl.STATIC_DRAW); 


const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);//creating vertex shader
webgl.shaderSource(vertexShader, 
    `		
	attribute vec3 pos;
	uniform mat4 p;
	uniform mat4 v;
	uniform mat4 m;
  uniform vec4 colour;
  varying vec4 fcolour;
	
    void main()
    {	
	   gl_Position = p*v*m*vec4(pos,1);  
	   fcolour = colour;
    }`);
webgl.compileShader(vertexShader);

webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
}

const fragmentShader =  webgl.createShader(webgl.FRAGMENT_SHADER);//creating a fragment shader
webgl.shaderSource(fragmentShader, 
    `precision mediump float;    
  varying vec4 fcolour;
	void main()
    {
       gl_FragColor = fcolour;
    }`);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling fragment Shader", webgl.getShaderInfoLog(fragmentShader));
}

const program = webgl.createProgram();//creating a program
webgl.attachShader(program, vertexShader);//attach vertex shader to the program
webgl.attachShader(program, fragmentShader);//attach fragment shader to the program
webgl.linkProgram(program);
webgl.useProgram(program);
webgl.enable(webgl.DEPTH_TEST);

//enable vertex and color attributes
const positionLocation = webgl.getAttribLocation(program, `pos`);//getting pos location
webgl.enableVertexAttribArray(positionLocation);  
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);
//uniform locations
const modelLocation			= webgl.getUniformLocation(program, `m`);
const viewLocation 			= webgl.getUniformLocation(program, `v`);
const projectionLocation 	= webgl.getUniformLocation(program, `p`);
const colourLocation = webgl.getUniformLocation(program, `colour`);

translate(redsquare, redsquare, [4, 4, -2]);
translate(whitesquare, whitesquare, [2, 0, -4]);
translate(bluesquare, bluesquare, [-3, 3, -2]);
translate(purplesquare, purplesquare, [4, -2, -4]);
translate(pacman,pacman,[-6.5,0,0]);
translate(view, view, [0.5, 0, 3]);
invert(view, view);

let bc1 = new Float32Array(rd);//colour of block one is red
let bc2 = new Float32Array(wh);//colour of block one is white
let bc3 = new Float32Array(bl);//colour of block one is blue
let bc4 = new Float32Array(pl);//colour of block one is purple
let pacmancolour = new Float32Array(yl);//colour of pacman one is yellow

webgl.uniformMatrix4fv(projectionLocation, false, projection);	
webgl.uniformMatrix4fv(viewLocation, false, view);
let s = 0.01;
draw();
function draw()
{    
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.uniform4fv(colourLocation,bc1);
  webgl.uniformMatrix4fv(modelLocation, false, redsquare);	
	webgl.drawArrays(webgl.TRIANGLES, 0, 6);	
	webgl.uniformMatrix4fv(modelLocation, false, whitesquare);	
  webgl.uniform4fv(colourLocation,bc2);
	webgl.drawArrays(webgl.TRIANGLES, 0, 6);	
	webgl.uniformMatrix4fv(modelLocation, false, bluesquare);		
  webgl.uniform4fv(colourLocation,bc3);
	webgl.drawArrays(webgl.TRIANGLES, 0, 6);	
	webgl.uniformMatrix4fv(modelLocation, false, purplesquare);		
  webgl.uniform4fv(colourLocation,bc4);
	webgl.drawArrays(webgl.TRIANGLES, 0, 6);
  translate(pacman,pacman,[s,0,0]);
	webgl.uniformMatrix4fv(modelLocation, false, pacman);		  
  webgl.uniform4fv(colourLocation,pacmancolour);
	webgl.drawArrays(webgl.TRIANGLE_FAN, 6, pacmanvertices.length/3);

						
  window.requestAnimationFrame(draw);
	}













































//======================================================================
// Matrix manipulation functions               
//======================================================================

//circle vertices method - for triangle fan
//draw triangle, rotate by theta and draw next
function circle(r,num){	

  let x,y,z = 0;
  let array = [0,0,0];
  for (let theta = (Math.PI)/num; theta <=2* (Math.PI); theta += (Math.PI)/num)
  {
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);  
      array.push(x);
      array.push(y);
      array.push(z);
  }
  return array;
  }
  
  function sphere(r,num){
    let sphere = [];
    let x,theta,phi;
    
    for(phi =0 ;phi<=Math.PI ; phi += Math.PI/num){
      z = r*Math.cos(phi);  //
      k= r*Math.sin(phi); //the radius of the circles goes from 0 to 1 to 0 
      
    //your old code to draw a circle or octagon
    for (let theta = 0; theta <=2* (Math.PI); theta += (Math.PI)/num)
    {
      x = k * Math.cos(theta);
      y = k * Math.sin(theta);
  
      sphere.push(x);
      sphere.push(y);		
      sphere.push(z);	//z goes from 1 to -1
    }	
      
    }
    return sphere;	
  }
  
  function pacmanshape(){
    let p = circle(1,32);
    return new Float32Array([p]);
  }

function ghostshape(){
  let g = [];

  return new Float32Array(g);
}
function roty(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
      0,1, 0,0,
      s,0, c,0,
      c,0,-s,0,
	  0,0, 0,1,
    ]);
  }

function rotx(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      c, 0,-s, 0,
	  0, 0, 0, 1,
    ]);
  }
 
 function rotz(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
      c,-s,0,0,
      s, c,0,0,
      0, 0,1,0,
	  0, 0,0,1,
    ]);
  }
  
  function rot(axis, angle){
	 if(axis == "x"){return rotx(angle);}
else if(axis == "y"){return roty(angle);}
  else if(axis == "z"){return rotz(angle);}}
  
  function translate(tx,ty,tz){
	 return new Float32Array([
	 1,0,0,0,
	 0,1,0,0,
	 0,0,1,0,
	 tx,ty,tz,1
	 ]); 
	  
  }
  
   function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];  //row 1, column 0 if it makes your code more readable [use it or don't use it]
    var a11 = a[5];  //row 1, column 1
    var a12 = a[6];  //row 1, column 2
    var a13 = a[7];  //row 1, column 3
    var a20 = a[8];  //row 2, column 0
    var a21 = a[9];  //row 2, column 1
    var a22 = a[10]; //row 2, column 2
    var a23 = a[11]; //row 2, column 3

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  function createmat4(){		
	return	new Float32Array([
	1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1
	]);
	}
	
	function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  
    function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }
  
 function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]; // Cache only the current line of the second matrix

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  
  
  function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  
   function translate(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  }
  
   function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }

  document.addEventListener("keydown",(event) => {
    switch(event.key){
      case 'a':
        rotateZ(pacman,pacman,-Math.PI/2);
        break;
      case 's':
        rotateZ(pacman,pacman,Math.PI/2);
    }
  });