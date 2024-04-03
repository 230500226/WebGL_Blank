const canvas = document.querySelector(`canvas`);
    const webgl = canvas.getContext(`webgl`);
    if(!webgl){ throw new Error("WebGL not available/supported");}
    webgl.clearColor(1.0,1.0,0,1); //r=0 g=1 b=0 values red green blue 1 0 ; rgba
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    //const vertices = new Float32Array([0,1,  -1,-1,  1,-1]);
    const vertices = new Float32Array([
        0.5,0.5, //three
        1.0,0.5, //of the 
        1.0,1.0, //1st triangle

        -0.5,-0.5, //three
        -1.0,-0.5, //of the 
        -1.0,-1.0, //2nd triangle  

        -0.5,-0.5, //three
        -0.5,-1.0, //of the 
        -1.0,-1.0, //3rd triangle 
        


    ]);
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
   
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader,
    `attribute vec2 pos;
    void main() { gl_Position = vec4(pos,0,1); }` ); //x/w, y/w, z/w 
    webgl.compileShader(vertexShader);
   
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader,
    `void main() { gl_FragColor = vec4(1.0,0,0,1.0); }`);
    webgl.compileShader(fragmentShader);
   
    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    
    const positionLocation = webgl.getAttribLocation(program, `pos`);
    webgl.enableVertexAttribArray(positionLocation);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
    //webgl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    webgl.useProgram(program);
    webgl.drawArrays(webgl.TRIANGLES, 0, 9);