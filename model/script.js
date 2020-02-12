
function init(){

	var canvas = document.getElementById("cnv_1");
	ctx = canvas.getContext("2d");

	var canvas_d = document.getElementById('cnv_2');
	var ctxd = canvas_d.getContext('2d');

	W = 720;
	H = 480;

	ctx.canvas.width = W;
	ctx.canvas.height = H;
	ctxd.canvas.width = W;
	ctxd.canvas.height = H;

	ctxd.fillStyle = "rgba(0,0,0,0)";
	ctxd.fillRect(0,0,W,H);

	var array = createMathArray(W, H);
	var IData = createImageArray(ctx, array, W, H);
	draw(ctx, IData);

	var pArray = createTestPoins(W, H, 40, true);
	var IPnt = createImagePoints(ctxd, pArray, W, H);
	drawPoints(ctxd, IPnt);

	var cleanCtx = document.getElementById("cleanButton");
	//cleanCtx.onclick = clean(W, H);
}


function createMathArray(W, H){
	/**** Set values ****/
	var circleRad 	= 240;
	var circleX 	= 300;
	var circleY 	= 180;
	var thickness	= 130;
	var level = H - thickness;

	var borderLine 		= createBorderLine(W, H, circleRad, circleX, circleY, level);

		/**** массивы отдельных полей и элементов ****/
	var borderArray			= createBorderArray(borderLine, W, H);
	var frictionArray 		= createFrictionArray(borderLine, W, H, thickness, circleRad, circleX, circleY);
	var dynamicXArray 		= createDynamicXArray(borderLine, W, H);
	var dynamicYArray 		= createDynamicYArray(borderLine, W, H);
	var electrostaticArray 	= createElectrostaticArray(borderLine, W, H, circleRad, circleX, circleY);
	var thresholdArrays		= createThresholdArrays(W, H, circleRad, circleX, circleY);
	var thresholdXArray 	= thresholdArrays[0];
	var thresholdYArray 	= thresholdArrays[1];

		/**** массивы для математических расчетов ****/
	staticData 		= sumData(W, H, frictionArray);
	dynamicXData	= sumData(W, H, dynamicXArray);
	dynamicYData	= sumData(W, H, dynamicYArray, electrostaticArray);
	leapXData		= sumData(W, H, thresholdXArray);
	leapYData		= sumData(W, H, thresholdYArray);

	var arrays = [
		borderArray,
		frictionArray,
		dynamicXArray,
		dynamicYArray,
		electrostaticArray,
		thresholdXArray,
		thresholdYArray
	];

		/**** массив для отрисовки ****/
	var drawData 	= createDrawData(arrays, W, H);
	
	var RGBAarray 	= converterMathToRGBA(drawData);
	return RGBAarray;
}


function fillMathAraay(W, H){
	var array = [];
	for (var i = 0; i < W; i++) {
		array[i] = [];
		for (var j = 0; j < H; j++){
			array[i][j] = 0;
		}
	}
	return array;
}


function converterMathToRGBA(data){
	var RGBAarray = [];
	for (var i = 0; i < data.length; i++) {
		RGBAarray[i] = [];
		for (var j = 0; j < data[i].length; j++){
			let n = (1 - data[i][j])*255;
			RGBAarray[i][j] = [n, n, n, 255];
		}
	}
	return RGBAarray;
}


function createImageArray(ctx, array, W, H){
	var IData = ctx.createImageData(W, H);

	for (var i = 0; i < W; i++) {
		for (var j = 0; j < H; j++){
			var n = ((i) + (j * W)) * 4;
			IData.data[n+0] = array[i][j][0];
			IData.data[n+1] = array[i][j][1];
			IData.data[n+2] = array[i][j][2];
			IData.data[n+3] = array[i][j][3];
		}
	}
	return IData;
}


function draw(ctx, IData){
	ctx.putImageData(IData, 0, 0);
}


function createImagePoints(ctxd, array, W, H){
	var IPnt = ctxd.createImageData(W, H);
	var arrayX = array[0];
	var arrayY = array[1];

	for (var i = 0; i < W; i++) {
		for (var j = 0; j < H; j++){
			var n = ((i) + (j * W)) * 4;
			IPnt.data[ n + 0 ] = 0;
			IPnt.data[ n + 1 ] = 0;
			IPnt.data[ n + 2 ] = 0;
			IPnt.data[ n + 3 ] = 0;
		}
	}

	for(var i = 0; i < arrayX.length; i++){
		var n = ((arrayX[i]) + (arrayY[i] * W)) * 4;
		IPnt.data[ n + 0 ] = 0;
		IPnt.data[ n + 1 ] = 0;
		IPnt.data[ n + 2 ] = 0;
		IPnt.data[ n + 3 ] = 255;
	}

	return IPnt;
}


function drawPoints(ctxd, IPnt){
	ctxd.putImageData(IPnt, 0, 0);
}


/*function animate(W, H){
	ctx_2.clearRect(0,0,W,H);

	if (Run == true) {window.requestAnimationFrame(animate)};
}*/