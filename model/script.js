
function init(){

	var canvas = document.getElementById("cnv_1");
	ctx = canvas.getContext("2d");

	W = 720;
	H = 480;

	ctx.canvas.width = W;
	ctx.canvas.height = H;

	var array = createMathArray(W, H);
	var IData = createImageArray(ctx, array, W, H);
	draw(ctx, IData);

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
	var staticData 		= sumData(W, H, frictionArray);
	var dynamicXData	= sumData(W, H, dynamicXArray);
	var dynamicYData	= sumData(W, H, dynamicYArray, electrostaticArray);
	var leapXData		= sumData(W, H, thresholdXArray);
	var leapYData		= sumData(W, H, thresholdYArray);

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
			let n = ((i) + (j * W)) * 4;
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
