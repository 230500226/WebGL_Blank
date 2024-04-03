    let btn = document.querySelector(`button`);
    let increment = 0.2;
    btn.addEventListener('click',()=>{
        increment = 0;
    });
    //1. Get a webgl context from the canvas
    //const canv = document.getElementById(`mycanv`);
    const canvas = document.querySelector(`canvas`);
    //const gl = document.querySelector('canvas').getContext('webgl');
    const webgl = canvas.getContext(`webgl`);
    if(!webgl){ throw new Error("WebGL not available/supported");}
    // 2. Set canvas color
    webgl.clearColor(1.0,1.0,0,1); //rgba
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    //3. Specify vertex data
    const vertices = new Float32Array([0,0, -1,-1,-1,0 ]);
    const colours = new Float32Array([1,1,0, 0,1,1, 1 ,0,1]);
    //4. Create buffer(s) for position, colour, or combined
    const buffer = webgl.createBuffer();
    const colourbuffer = webgl.createBuffer();
    //5. Bind the buffer as the current buffer
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    //6. Specify that buffer data from vertex data
    webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, colourbuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, colours, webgl.STATIC_DRAW);
    
    //7. Create the two shaders source
    const vs = document.querySelector("#vs").text;
    const fs = document.querySelector("#fs").text;
    console.log(vs);
    console.log(fs);

    const vsSource =`     
    attribute vec2 pos;
    attribute vec3 colours;    
    varying vec3 fragcolours;
    float x;
    float y;
    uniform float angle;
    //float angle = 0.5;//3.141592/2.0;
    void main() { 
        //x = pos.x*cos(phi) + pos.y*sin(phi);
        //y = pos.y*cos(phi) - pos.x*sin(phi);
        x = pos.x*cos(angle) -pos.y*sin(angle);
        y = pos.x*sin(angle) +pos.y*cos(angle);
        gl_Position = vec4(x,y,0,1) ;//
        fragcolours = colours;  }`
    const fsSource = `
    precision mediump float;
   varying vec3 fragcolours;
    void main() { 
        gl_FragColor = vec4(fragcolours,1.0); }`;
    //8. Create Javascript reference to the shaders    
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    //9. Pass the shader sources to the shader reference
    webgl.shaderSource(vertexShader, vs /*Source*/ ); 
    webgl.shaderSource(fragmentShader, fs /*Source*/);
    //10. Compile the shaders
    webgl.compileShader(vertexShader);   
   webgl.compileShader(fragmentShader);

   if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
}

   //11. Create a program, attach shaders and link program
    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    //12. Find a reference to each of the attributes in the shader
    const positionLocation = webgl.getAttribLocation(program, `pos`);
    //13.Enable the attribute, it is disabled by default
    webgl.enableVertexAttribArray(positionLocation);
    //14. Specify the layout of the vertex data
    //webgl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, colourbuffer);
    const coloursLocation = webgl.getAttribLocation(program, `colours`);
    webgl.enableVertexAttribArray(coloursLocation);
    webgl.vertexAttribPointer(coloursLocation, 3, webgl.FLOAT, false, 0,0);
    
    //specify which program you are using
    webgl.useProgram(program);
    //finally draw the primitives i.e triangles/lines
    
    let angle = 0.0;
    draw();
    function draw(){
        //webgl.clear(webgl.COLOR_BUFFER_BIT);
        angle += increment;//0.2;
        webgl.uniform1f(webgl.getUniformLocation(program, `angle`), angle);
        webgl.drawArrays(webgl.TRIANGLES, 0, 3);
        window.requestAnimationFrame(draw);
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