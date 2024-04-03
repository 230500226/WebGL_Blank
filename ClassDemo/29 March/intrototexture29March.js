    const canvas = document.querySelector(`canvas`);
    const webgl = canvas.getContext(`webgl`);
    webgl.clearColor(1.0,1.0,0,1); 
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    const vertices = new Float32Array([-1,-1,  0,1,  1,-1]);
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

    const textures = new Float32Array([0,0.5,  0.5,1,  1,0]);
    const texturebuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, texturebuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, textures, webgl.STATIC_DRAW);
    let imagedata = new Image();
    imagedata.src ="textures/t4.jpg"; 
    const vsSource = vs.text;
    const fsSource = fs.text;
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, vsSource ); 
    webgl.compileShader(vertexShader);   
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, fsSource);
    webgl.compileShader(fragmentShader);  
    
    if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
      }
      if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
        console.error("Error compiling fragment Shader", webgl.getShaderInfoLog(fragmentShader));
      }
    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);    
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    const positionLocation = webgl.getAttribLocation(program, `pos`);
    webgl.enableVertexAttribArray(positionLocation);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, texturebuffer);
    const textureLocation = webgl.getAttribLocation(program, `texCoord`);
    webgl.enableVertexAttribArray(textureLocation);
    webgl.vertexAttribPointer(textureLocation, 2, webgl.FLOAT, false, 0, 0);
      
    const texture = webgl.createTexture();
    webgl.bindTexture(webgl.TEXTURE_2D,texture);
     /*  if your dimensions are not powers of two then comment out line 143 and uncomment 137-140	*/
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
	
	webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGBA,webgl.RGBA,webgl.UNSIGNED_BYTE,imagedata);
	webgl.generateMipmap(webgl.TEXTURE_2D);

    //webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGB,4,4,0,0,webgl.RGB,webgl.UNSIGNED_BYTE,imagedata);

    webgl.useProgram(program);
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);