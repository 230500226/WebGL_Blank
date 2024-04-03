    
    
    function app(){
      const vsSource = vs.text;
      const fsSource = fs.text;
      let image = new Image();      
      image.src ="textures/t8.jpg";    
      //image.src ="textures/t4 UV coords.jpg"; 
      image.onload = function() {
      paint(image,vsSource,fsSource);
      }
    }
    app();

    function paint(imagedata,vsSource,fsSource){
      const canvas = document.querySelector(`canvas`);
    const webgl = canvas.getContext(`webgl`);
    webgl.clearColor(1.0,1.0,0,1); 
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
    const vertices = new Float32Array([-1,-1,  0,1,  1,-1]);
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

    const textures = new Float32Array([0,0.5,  0.5,1,  1,0.5]);
    const texturebuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, texturebuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, textures, webgl.STATIC_DRAW);
    
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, vsSource ); 
    webgl.compileShader(vertexShader);   
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, fsSource);
    webgl.compileShader(fragmentShader);  
    
    logshadererrors(webgl,vertexShader,fragmentShader);
    const program = webgl.createProgram();
    attachandlink(webgl,program,vertexShader,fragmentShader); 
    enableAttribute(webgl,program,buffer,`pos`);     
    enableAttribute(webgl,program,texturebuffer,`texCoord`); 
    const texture = webgl.createTexture();
    webgl.bindTexture(webgl.TEXTURE_2D,texture);
    webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGBA,webgl.RGBA,webgl.UNSIGNED_BYTE,imagedata);
	
    if (isPowerOf2(imagedata.width) && isPowerOf2(imagedata.height)){
      webgl.generateMipmap(webgl.TEXTURE_2D);
    }
    else{
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
	    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
	    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
	    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    }	
	  webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGBA,webgl.RGBA,webgl.UNSIGNED_BYTE,imagedata);
	    webgl.useProgram(program);
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
    }

//------------------end of program - just two utilities below --------

    function logshadererrors(webgl,vertexShader,fragmentShader){
      if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
      }
      if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
        console.error("Error compiling fragment Shader", webgl.getShaderInfoLog(fragmentShader));
      }
    }

    function isPowerOf2(value) {
      return (value & (value-1)) === 0;
    }

    function attachandlink(webgl,program,vertexShader,fragmentShader){
      webgl.attachShader(program, vertexShader);
      webgl.attachShader(program, fragmentShader);
      webgl.linkProgram(program); 
    }

    function enableAttribute(webgl,program,buffer,attr){
      webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
      const attribLocation = webgl.getAttribLocation(program, attr);
      webgl.enableVertexAttribArray(attribLocation);
      webgl.vertexAttribPointer(attribLocation, 2, webgl.FLOAT, false, 0, 0);
    }