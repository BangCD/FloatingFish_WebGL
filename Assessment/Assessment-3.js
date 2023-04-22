111
var gl;
var points;
var numTimesToSubdivide = 0;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalsArray = [];
var near = 0.1;
var far = 1000.0;
var fovy = 45.0; 

var eye = vec3(0, 0, -90);
var at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);

window.onload = function init()
{
   
   

/** @type {HTMLCanvasElement} */
 var canvas = document.getElementById( "gl-canvas" );


/** @type {WebGLRenderingContext} */
 var gl = canvas.getContext("webgl2");




 var aspect = canvas.height / canvas.width;

 //gl = WebGLUtils.setupWebGL( canvas );
 if ( !gl ) { alert( "WebGL isn't available" ); }


var FishBody= new Float32Array([

   //Front
   -5,-5,0.0,   1.0, 
      8,0.0,0.0,     1.0,   
      -5,5,0.0,     1.0, 

   //Face Side
   -5,5,0.0,     1.0, 
      -5,5,-5,    1.0, 
      -5,-5,-5,  1.0, 

      -5,-5,-5,   1.0, 
      -5,-5,0.0,   1.0,   
     -5,5,0.0,    1.0,   
      //Botton Side
   -5,-5,-5,   1.0, 
      8,0,-5,   1.0,      
     8,0,0,   1.0, 

      8,0,0,    1.0,        
     -5,-5,0.0,   1.0,   
     -5,-5,-5,   1.0,  

   //Top Side
   -5,5,-5,   1.0, 
   8,0,-5,  1.0,     
   8,0,0,   1.0,      

   8,0,0,     1.0,      
      -5,5,0,  1.0,      
      -5,5,-5,   1.0, 

      //Back

   -5,-5,-5,  1.0,  
      8,0,-5,  1.0,     
   -5,5,-5,    1.0,  
 ]);

 var FishBodyUV= new Float32Array([
   1,0,
 
   0,0,
 0,1,
 
 
 1,0,
  
 0,0,
  
 0,1,
 
 
 1,0,
  
 0,0,
  
  0,1,
 
 1,0,
  
  0,0,
 
   0,1,
  1,0,
 
  0,0,
 
 0,1,
 
 
 1,0,
  
  0,0,
 
 0,1,
 
 
 1,0,
  
 0,0,
  
  0,1,
 
 1,0,
  
  0,0,
 
  0,1,
 
 ]);

 var FishBodyNormal = new Float32Array([

    //Front
    0,0,1,
    0,0,1,
    0,0,1,
    
    //Back 
    0,0,-1,
    0,0,-1,
    0,0,-1,

    //Face Side
   1,0,0,
   1,0,0,
   1,0,0,

   1,0,0,
   1,0,0,
   1,0,0,

   //Bottom Side
   0,-1,0,
   0,-1,0,
   0,-1,0,

   0,-1,0,
   0,-1,0,
   0,-1,0,
   
   //Top Side
   0,1,0,
   0,1,0,
   0,1,0,

   0,1,0,
   0,1,0,
   0,1,0,

 ]);

var fishHead = new Float32Array([

   //Front
   -10,0,0,      1,0,
   -5,-5,0,      0,0,
   -5,5,0,       1,1,


   //Bottom Side 

   -10,0,-5,        1,0,
   -5,-5,-5,        0,0,
   -5,-5,0,      0,1,

   -5,-5,0,      1,0,
   -10,0,0,           0,0,
   -10,0,-5,        0,1,

   //Top Side

   -10,0,0,        1,0,
   -5,5,0,        0,0,
   -5,5,-5,       0,1,

   -5,5,-5,       1,0,
   -10,0,-5,       0,0,
   -10,0,0,        0,1,

   //Body Side
   -5,-5,0,      1,0,
   -5,-5,-5,   0,0,
   -5,5,-5,    0,1,

   -5,5,-5,    1,0,
   -5,5,0,       0,0,
   -5,-5,0,      0,1,

   //Back
   -10,0,-5,    1,0,
   -5,5,-5,    0,0,
   -5,-5,-5,   1,1,


]);


var fishTopFin = new Float32Array([

   //Front
   -1,3, 0,       1,0,
   3, 1,0,     0,0,
   6, 6,0,    0,1,

   //Back 
   -1,3, -5,       1,0,
   3, 1, -5,     0,0,
   6, 6, -5,    0,1,

   //Bottom 
   3,1,0,        1,0,
   -1,3,0,       0,0,
   -1,3,-5,    0,1,

   -1,3,-5,    1,0,
   3,1,-5,       0,0,
   3,1,0,          0,1,

   //Right
   3,1,0,       1,0,
   3,1,-5,    0,0,
   6,6,-5,  0,1,

   6,6,-5,  1,0,
   6,6,0,     0,0,
   3,1,0,       0,1,

   //Left
   -1,3,0,    1,0,
   6,6,0,     0,0,
   6,6,-5,  0,1,

   6,6,-5,  1,0,
   -1,3,-5, 0,0,
   -1,3,0,    0,1,

]);


var fishBottomFin= new Float32Array([

   //Front
   -1, -3,0,     1,0,
   6, -6,0,      0,0,
   3, -1,0,      0,1,

   //Back
   -1, -3,  -5,   1,0,
   6, -6,  -5,    0,0,
   3, -1,  -5,    0,1,

   //Right
   6,-6,-5,       1,0,
   3,-1,-5,       0,0,
   3,-1,0,          0,1,

   3,-1,0,          1,0,
   6,-6,0,          0,0,
   6,-6,-5,          0,1,

   //Top
   -1,-3,0,         1,0,
   3,-1,0,          0,0,
   3,-1,-5,         0,1,

   3,-1,-5,       1,0,
   -1,-3,-5,      0,0,
   -1,-3,0,       0,1,

   //Left
   6,-6,0,          1,0,
   -1,-3,0,         0,0,
   -1,-3,-5,        0,1,

   -1,-3,-5,      1,0,
   6,-6,-5,       0,0,
   6,-6,0,        0,1,


]);



var fishTopTailFin= new Float32Array([

   //Front 
   8.5, 0, -1,        1,0,      
   9, 9, -1,      0,0,
   12,4, -1,        0,1,


   //Back 
   8.5, 0, -3,        1,0,
   9, 9, -3,      0,0,
   12,4, -3,        0,1,

   //Left
   8.5,0,-3,          1,0,
   8.5,0,-1,          0,0,
   12,4,-1,          0,1,

   12,4,-1,          1,0,
   12,4,-3,          0,0,
   8.5,0,-3,          0,1,

   //Right Bot
   8.5,0,-1,          1,0,
   8.5,0,-3,          0,0,
   9,9,-3,        0,1,

   9,9,-3,       1,0,
   9,9,-1,       0,0,
   8.5,0,-1,         0,1,

   //Right Top
   9,9,-3,        1,0,
   12,4,-3,          0,0,
   12,4,-1,          0,1,

   12,4,-1,          1,0,
   9,9,-1,        0,0,
   9,9,-3,        0,1,

]);

var fishBottomTailFin = new Float32Array([

   //Front 
   12,-4,-1,     1,0,
   9,-9,-1,      0,0,
   8.5,0,-1,    0,1,

   //Back
   12,-4,-3,     1,0,
   9,-9,-3,      0,0,
   8.5,0,-3,    0,1,

   //Left
   12,-4,-3,    1,0,
   12,-4,-1,    0,0,
   8.5,0,-1,    0,1,

   8.5,0,-1,   1,0,
   8.5,0,-3,   0,0,
   12,-4,-3,   0,1,

   //Right Bot
   12,-4,-1,    1,0,
   12,-4,-3,    0,0,
   9,-9,-3,     0,1,

   9,-9,-3,     1,0,
   9,-9,-1,      0,0,
   12,-4,-1,    0,1,

   //Right Top
   9,-9,-3,     1,0,
   8.5,0,-3,    0,0,
   8.5,0,-1,    0,1,

   8.5,0,-1,    1,0,
   9,-9,-1,     0,0,
   9,-9,-3,     0,1,


]);


 // Configure WebGL
 gl.viewport( 0, 0, canvas.width, canvas.height );
 gl.clearColor(0.0, 0.0, 0.0, 0.0);

 // Load shaders and initialize attribute buffers

 var program = initShaders( gl, "vertex-shader", "fragment-shader" );
 
 gl.useProgram( program );


 gl.enable(gl.DEPTH_TEST);

 


   




   function drawScene(){
      gl.useProgram( program );

      var bodyNormalBuffer= gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,bodyNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,FishBodyNormal,gl.STATIC_DRAW);
   
      var normalLocation=gl.getAttribLocation(program,"a_normal");
      gl.vertexAttribPointer(normalLocation,3,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(normalLocation);



      //Buffer For Main Body 

      var FSIZE=FishBody.BYTES_PER_ELEMENT;
      var fishBodyBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishBodyBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,FishBody,gl.STATIC_DRAW);
   
   
      var vPosition=gl.getAttribLocation(program,"vPosition");
      gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,FSIZE*4,0);
      gl.enableVertexAttribArray(vPosition);

      var fishBodyUVBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishBodyUVBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,FishBodyUV,gl.STATIC_DRAW);

      var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT,0);
      gl.enableVertexAttribArray(vTexCoord);
   
      
     var bodyTexture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,bodyTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('fishScale'));
   
      gl.bindTexture(gl.TEXTURE_2D, bodyTexture);
		gl.activeTexture(gl.TEXTURE0);
         

      //Buffer for Head
      
      var FSIZE1=fishHead.BYTES_PER_ELEMENT;
      var fishHeadBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishHeadBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,fishHead,gl.STATIC_DRAW);
   
      var vPosition=gl.getAttribLocation(program,"vPosition");
      gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,FSIZE1*5,0);
      gl.enableVertexAttribArray(vPosition);
   
      var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(vTexCoord);
   
      
     var headTexture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,headTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('fishHead'));
   
      gl.bindTexture(gl.TEXTURE_2D, headTexture);
		gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES,0,24);

      //Buffer for Top Fin

      var FSIZE1=fishTopFin.BYTES_PER_ELEMENT;
      var fishTopFinBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishTopFinBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,fishTopFin,gl.STATIC_DRAW);
   
      var vPosition=gl.getAttribLocation(program,"vPosition");
      gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,FSIZE1*5,0);
      gl.enableVertexAttribArray(vPosition);
   
      var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(vTexCoord);
   
      
     var topFinTexture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,topFinTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('fishFin'));
   
      gl.bindTexture(gl.TEXTURE_2D, topFinTexture);
		gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES,0,24);

      //Buffer for Bottom Fin

      var FSIZE1=fishBottomFin.BYTES_PER_ELEMENT;
      var fishBottomFinBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishBottomFinBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,fishBottomFin,gl.STATIC_DRAW);
   
      var vPosition=gl.getAttribLocation(program,"vPosition");
      gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,FSIZE1*5,0);
      gl.enableVertexAttribArray(vPosition);
   
      var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(vTexCoord);
   
      
     var bottomFinTexture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,bottomFinTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('fishFin'));
   
      gl.bindTexture(gl.TEXTURE_2D, bottomFinTexture);
		gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES,0,24);


      //Buffer for Top Tail Fin

      var FSIZE1=fishTopTailFin.BYTES_PER_ELEMENT;
      var fishTopTailFinBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishTopTailFinBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,fishTopTailFin,gl.STATIC_DRAW);
   
      var vPosition=gl.getAttribLocation(program,"vPosition");
      gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,FSIZE1*5,0);
      gl.enableVertexAttribArray(vPosition);
   
      var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(vTexCoord);
   
      
     var topTailFinTexture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,topTailFinTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('fishTopTailFin'));
   
      gl.bindTexture(gl.TEXTURE_2D, topTailFinTexture);
		gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES,0,24);

      //Buffer for Bottom Tail Fin

      var FSIZE1=fishBottomTailFin.BYTES_PER_ELEMENT;
      var fishBottomTailFinBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,fishBottomTailFinBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,fishBottomTailFin,gl.STATIC_DRAW);
   
      var vPosition=gl.getAttribLocation(program,"vPosition");
      gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,FSIZE1*5,0);
      gl.enableVertexAttribArray(vPosition);
   
      var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(vTexCoord);
   
      
     var bottomTailFinTexture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,bottomTailFinTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('fishBottomTailFin'));
   
      gl.bindTexture(gl.TEXTURE_2D, bottomTailFinTexture);
		gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES,0,24);
      
   };
   
   






   var colorLocation = gl.getUniformLocation(program, "u_color");
   var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

   //var lightposition= mat3();

   // gl.uniform3fv(reverseLightDirectionLocation, normalize(flatten(lightposition)));
   // gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]);

   modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
   projectionMatrixLoc = gl.getUniformLocation(program,"projectionMatrix");

   modelViewMatrix = lookAt(eye, at, up);
   projectionMatrix = perspective(fovy, aspect, near, far);

   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix4fv(projectionMatrixLoc, false,flatten(projectionMatrix));

   gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);




   const uniformLocations={worldMatrix:gl.getUniformLocation(program,'matrix')}

   var matrix= mat4();
   var angle=0.1;
   var x_Move=0.1;
   var x_Down=1;
   var y_Down=1;
   var animationFlag;
   var fishMoveFrame;
   var moveFlag;
   var fishMoveRotate;
   var openMovement=mat4();
   var freeLeft=0;
   var freeUp=0;
   var freeDown=0;
   var freeRight=0;
   var freeClose=0;
   var freeFar=0;
   var freeRotateX=0;
   var freeRotateY=0;
   var freeRotateZ=0;
   var fishRotateFrame

   function stopRotation(){
      
      
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      cancelAnimationFrame(fishRotateFrame);
      fishRotateFrame=undefined;
      drawScene();
   }

   function defaultScene(){
      cancelAnimationFrame(fishMoveFrame);
      gl.clear(gl.COLOR_BUFFER_BIT);
      var tempmatrix= mat4();
      matrix=tempmatrix;
      matrix;
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      drawScene();
   }



 function moveRight(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(moveRight);
         freeRight-=0.1;
         openMovement=mult(translate(freeRight,0,0),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function moveUP(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(moveUP);
         freeUp+=0.1;
         openMovement=mult(translate(0,freeUp,0),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}


function moveDown(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(moveDown);
         freeDown-=0.1;
         openMovement=mult(translate(0,freeDown,0),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function moveLeft(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(moveLeft);
         freeLeft+=0.1;
         openMovement=mult(translate(freeLeft,0,0),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function moveFar(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(moveFar);
         freeFar+=0.1;
         openMovement=mult(translate(0,0,freeFar),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function moveClose(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(moveClose);
         freeClose-=0.1;
         openMovement=mult(translate(0,0,freeClose),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function freeMoveRotateX(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(freeMoveRotateX);
         freeRotateX-=0.1;
         openMovement=mult(rotate(freeRotateX,1,0,0),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function freeMoveRotateY(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(freeMoveRotateY);
         freeRotateY-=0.1;
         openMovement=mult(rotate(freeRotateY,0,1,0),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

function freeMoveRotateZ(){
   //matrix=scaleImg(1,1,1);
   setTimeout(function(){ 
      console.log("called");
      if( moveFlag ==true)
      {
         fishMoveFrame = requestAnimationFrame(freeMoveRotateZ);
         freeRotateZ-=0.1;
         openMovement=mult(rotate(freeRotateZ,0,0,1),openMovement);
         gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(openMovement));
         drawScene(); 
      moveFlag=false}
      else {   
            cancelAnimationFrame(fishMoveFrame)
            }
      
      },100);
}

   function animeRotate(){
      setTimeout(function(){ 
      fishRotateFrame = requestAnimationFrame(animeRotate);
         angle+=5;
      matrix=rotate(angle,1 ,0,1);
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
         drawScene();
        stopRotation();
       ;},100);
   }


   function rightTranslate(){
      matrix=scaleImg(1,1,1);
      setTimeout(function(){ 
         if( moveFlag ==true)
         {
            fishMoveFrame = requestAnimationFrame(rightTranslate);
            x_Move-=0.5;
            matrix=translate(Math.sin(x_Move),0,0);
            gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
            // console.log(matrix);
            drawScene(); }
         else {   
               cancelAnimationFrame(fishMoveFrame)
               }
         
         },100);
   }

   function scaleFishDown(){
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      x_Down-=0.1;
      y_Down-=0.1;
      matrix=scaleImg(Math.sin(x_Down),Math.sin(y_Down),0);
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      drawScene();
   }


   function moveRotateZ(){
      console.log("move rotate called")
      setTimeout(function(){ 
      if(moveFlag==true)
      {
      fishMoveRotate=requestAnimationFrame(moveRotateZ);
      x_Move-=0.05;
      angle +=3;
      matrix=mult(translate(Math.sin(x_Move),0,0), rotate(angle,0 ,0,1) );
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      drawScene();
      }
      else {
         cancelAnimationFrame(fishMoveRotate);
      }
      },100);
   }


   function moveRotateX(){
      console.log("move rotate called")
      setTimeout(function(){ 
      if(moveFlag==true)
      {
      fishMoveRotate=requestAnimationFrame(moveRotateX);
      x_Move-=0.05;
      angle +=3;
      matrix=mult(translate(Math.sin(x_Move),0,0), rotate(angle,1 ,0,0) );
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      drawScene();
      }
      else {
         cancelAnimationFrame(fishMoveRotate);
      }
      },100);
   }



   function moveRotateY(){
      console.log("move rotate called")
      setTimeout(function(){ 
      if(moveFlag==true)
      {
      fishMoveRotate=requestAnimationFrame(moveRotateY);
      x_Move-=0.05;
      angle +=3;
      matrix=mult(translate(Math.sin(x_Move),0,0), rotate(angle,0 ,1,0) );
      gl.uniformMatrix4fv(uniformLocations.worldMatrix,false,flatten(matrix));
      drawScene();
      }
      else {
         cancelAnimationFrame(fishMoveRotate);
      }
      },100);
   }

   defaultScene();

   const bodyElement = document.querySelector( "body" );

	bodyElement.addEventListener( "keydown", KeyDown, false );

   function KeyDown( event )
	{
		if ( "d" === event.key )
		{
         moveFlag=true;
         moveRight();
		}
		else if ( "w" === event.key )
		{
         moveFlag=true;
         moveUP();
		}
      else if ( "s" === event.key )
		{
         moveFlag=true;
         moveDown();
		}
      else if ( "a"=== event.key )
		{
         moveFlag=true;
         moveLeft();
		}
      else if ( "D" === event.key )
		{
         moveFlag=true;
         moveRight();
		}
		else if ( "W" === event.key )
		{
         moveFlag=true;
         moveUP();
		}
      else if ( "S" === event.key )
		{
         moveFlag=true;
         moveDown();
		}
      else if ( "A"=== event.key )
		{
         moveFlag=true;
         moveLeft();
		}
      else if ( "x" === event.key )
		{
         moveFlag=true;
         moveFar();
		}
      else if ( "X"=== event.key )
		{
         moveFlag=true;
         moveFar();
		}
      else if ( "z" === event.key )
		{
         moveFlag=true;
         moveClose();
		}
      else if ( "Z"=== event.key )
		{
         moveFlag=true;
         moveClose();
		}
      else if ( "r" === event.key )
		{
         moveFlag=true;
         freeMoveRotateX();
		}
      else if ( "R"=== event.key )
		{
         moveFlag=true;
         freeMoveRotateX();
		}
      else if ( "E" === event.key )
		{
         moveFlag=true;
         freeMoveRotateY();
		}
      else if ( "e"=== event.key )
		{
         moveFlag=true;
         freeMoveRotateY();
		}
      else if ( "F" === event.key )
		{
         moveFlag=true;
         freeMoveRotateZ();
		}
      else if ( "f"=== event.key )
		{
         moveFlag=true;
         freeMoveRotateZ();
		}
   };

 window.onkeydown = function(event) {
   var key = String.fromCharCode(event.keyCode);
   switch (key) {
   case "1":
      moveFlag=false;
      defaultScene();
   break;
   case "2":
      moveFlag= true;
      rightTranslate();
      break;
   case "3":
      scaleFishDown();
      break;
   case "4":
      moveFlag=true;
      moveRotateZ();
      break;
   case "5":
      moveFlag=true;
      moveRotateX();
      break;

   case "6":
      moveFlag=true;
      moveRotateY();
      break;
   
   case "87":
      console.log(event);
      moveFlag=true;
      moveLeft();
      break;
   }
   };




   var counter;
   
   function start() {
     counter = setInterval(function() {
       animeRotate()
     }, 5);
   }
   function end() {
     clearInterval(counter)
   }


   var myButton = document.getElementById("StopButton");
   myButton.addEventListener("mousedown", function() { start();
   });

   myButton.addEventListener("mouseup",function(){
      end();
   });
 



console.log(gl.getParameter(gl.VERSION));
var glversion=gl.getParameter(gl.VERSION);
var version =document.getElementById("myheader").innerHTML="Version number is " +glversion
};

function scaleImg( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}
