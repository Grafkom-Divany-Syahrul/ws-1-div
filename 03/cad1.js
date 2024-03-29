"use strict";

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumPositions  = 3*maxNumTriangles;
var index = 0;
var first = true;

var t = [];

var cIndex = 0;

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

init();

function init() {
  // membuat warna dapat dipilih dengan button
  var button = document.getElementsByClassName("button");
		var addSelectClass = function(){
			removeSelectClass();
			this.classList.add('selected');
      cIndex = this.value;
      console.log(this.value);	
		}

		var removeSelectClass = function(){
			for (var i =0; i < button.length; i++) {
				button[i].classList.remove('selected')
			}
		}
		
		for (var i =0; i < button.length; i++) {
			button[i].addEventListener("click",addSelectClass);
		}

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0,0, canvas.width, canvas.height);
    gl.clearColor(0.99, 0.96, 0.93, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPositions, gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumPositions, gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation( program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // var m = document.getElementsByClassName("button selected")

    // m.addEventListener("click", function() {
    //    cIndex = m.val();
    //   });


    canvas.addEventListener("mousedown", function(event){
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        if(first) {
          first = false;
          gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer)
          t[0] = vec2(2*(event.clientX - canvas.offsetLeft)/canvas.width-1, //adjust mengikuti posisi canvas karena canvas digeser ke tengah
            2*(canvas.height - event.clientY + canvas.offsetTop)/canvas.height-1);
        }

        else {
          first = true;
          t[2] = vec2(2*(event.clientX - canvas.offsetLeft)/canvas.width-1, //adjust mengikuti posisi canvas karena canvas digeser ke tengah
            2*(canvas.height-event.clientY + canvas.offsetTop)/canvas.height-1);
          t[1] = vec2(t[0][0], t[2][1]);
          t[3] = vec2(t[2][0], t[0][1]);
          for(var i=0; i<4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+i), flatten(t[i]));
          index += 4;

          gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
          var tt = vec4(colors[cIndex]);
          for(var i=0; i<4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4+i), flatten(tt));
        }
    });
    render();
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    for(var i = 0; i<index; i+=4)
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    requestAnimationFrame(render);
}
