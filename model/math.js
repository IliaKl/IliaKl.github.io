
function createBorderLine(W, H, circleRad, circleX, circleY, level){
	var BA = [];
	for (var i = 0; i < W; i++){
		BA[i] = level;	}
	for (var i = circleX - circleRad; i < circleX + circleRad; i++) {
			/*** y = y0 +- sqrt(R^2 - (x-x0)^2) ***/
		var Y = circleY + Math.sqrt( circleRad**2 - ( i - circleX )**2 );
		if (BA[i] < Y) {
			BA[i] = Y;
	}}
	for (var dY = 3; dY < 10; dY++ ) {
		for (var i = dY; i < W - dY; i++ ) {
			var y0 = BA[ i - dY ];
			var y1 = BA[ i ];
			var y2 = BA[ i + dY ];
			var q = 0.01;		
			if( y1 < (y0 + y2) / 2 - q * 10 ){
				BA[i] = (y0 + y2) / 2 - q * 10;
		}}
		for (var i = W - dY; i > dY; i-- ) {
			var y0 = BA[ i - dY ];
			var y1 = BA[ i ];
			var y2 = BA[ i + dY ];
			var q = 0.01;
			if( y1 < (y0 + y2) / 2 - q * 10 ){
				BA[i] = (y0 + y2) / 2 - q * 10;
	}}}
	for (var i = circleX - circleRad; i < circleX + circleRad; i++) {
		var Y = circleY + Math.sqrt( circleRad**2 - ( i - circleX )**2 );
		if (BA[i] < Y) {
			BA[i] = Y;
	}}
	/*for (var i = 0; i < W; i++){
		BA[i] = ~~BA[i];	}*/

	return BA;
}


function createBorderArray(line, W, H){
	var array = fillMathAraay(W, H);
	for (var i = 0; i < W; i++){
		var n = ~~line[i];
		array[i][n] = 1;
	}
	return array;
}


function createFrictionArray(line, W, H, thickness, circleRad, circleX, circleY){
	var array = fillMathAraay(W, H);

	for (var i = 0; i < W; i++){
		var LDA_i = 1 - ( ( H - line[i] ) / thickness );
		for (var j = ~~line[i]; j < H; j++ ){
			array[i][j] += LDA_i;
		}
	}

	for (var i = 0; i < W; i++) {
		var mass = 0.2;
		var delta_mass = mass/(H-line[i]);
		for (var j = ~~line[i]; j < H; j++) {
			array[i][j] += (( j - line[i] ) * delta_mass);
		}
	}

	var circl = circle(circleX, circleY, circleRad, W, H);

	for (var i = 0; i < W; i++) {
		for (var j = 0; j < H; j++){
			array[i][j] += circl[i][j];
		}
	}

	return array;
}


function circle(x0, y0, rad, W, H) {

	var array  = fillMathAraay(W, H);
	var m = 0.5;

	var x1, x2, x3, x4, y1, y2, y3, y4;

	x1 = x0 + rad;
	y1 = y0;

	for ( ; x1 >= x0; ) {

		x2 = x0 - x1 + x0;
		y2 = y1;
		x3 = x1;
		y3 = y0 - y1 + y0;
		x4 = x0 - x1 + x0;
		y4 = y0 - y1 + y0;

		if ( x1 >= 0 && y1 >= 0 ) array[x1][y1] = m;
		if ( x2 >= 0 && y2 >= 0 ) array[x2][y2] = m;
		if ( x3 >= 0 && y3 >= 0 ) array[x3][y3] = m;
		if ( x4 >= 0 && y4 >= 0 ) array[x4][y4] = m;

		var ArrX = [ x1, x1, x1 - 1, x1 - 1 ];
		var ArrY = [ y1, y1 + 1, y1, y1 + 1 ];
		var error = rad;
		var num = 0;
		for ( var n = 1; n < 4; n++ ){
			var error_loc = Math.abs(( ArrX[n] - x0 )**2 + ( ArrY[n] - y0 )**2 - rad**2);
			if ( error_loc < error ) {
				error = error_loc;
				num = n;
			}
		}
		x1 = ArrX[num];
		y1 = ArrY[num];
	}

	return array;
}


function createDynamicXArray(line, W, H){
	var array = fillMathAraay(W, H);
	for(var i = 0; i < W; i++){
		for(var j = ~~line[i]; j < H; j++){
			array[i][j] = 0.2;
		}
	}
	return array;
}


function createDynamicYArray(line, W, H){
	var array = fillMathAraay(W, H);
	for (var i = 0; i < W - 1; i++) {
		var dY = ( H - line[ i + 1 ] - ( H - line[i] ));
		var t = H - line[i];
		for (var j = ~~line[i]; j < H; j++) {
			array[i][j] = ( dY - dY / t * ( j - line[i] )) * (-0.3);
		}
	}
	for (var j = ~~line[ W - 1 ]; j < H; j++) {
		array[ W - 1 ][j] = array[ W - 2 ][j];
	}
	return array;
}


function createElectrostaticArray(line, W, H, circleRad, circleX, circleY){
	var array = fillMathAraay(W, H);

	for( var i = 0; i < W; i++ ){
		var n = 0.3;
		for( var j = ~~line[i] - 1;; j-- ){
			if (( n < 0.00001 ) || ( j < 0 )) break;
			array[i][j] = n;
			n -= 0.004;
		}
	}

	for (var i = circleX - circleRad; i < circleX + circleRad; i++) {
			/*** y = y0 +- sqrt(R^2 - (x-x0)^2) ***/
		var Y = circleY + Math.sqrt( circleRad**2 - ( i - circleX )**2 );
		for(var j = ~~Y; j >= 0; j--){
			array[i][j] = 0;
		};

	}

	return array;
}


function createThresholdArrays(W, H){
	var arrayX = fillMathAraay(W, H);
	var arrayY = fillMathAraay(W, H);

	var array = [arrayX, arrayY];
	return array;
}


function createDrawData( arrays, W, H ){

	var borderArray			= arrays[0];
	var frictionArray		= arrays[1];
	var dynamicXArray		= arrays[2];
	var dynamicYArray		= arrays[3];
	var electrostaticArray	= arrays[4];
	var thresholdXArray 	= arrays[5];
	var thresholdYArray 	= arrays[6];

	var array = fillMathAraay(W, H);

	var chekcboxes = [];
	chekcboxes[0] = document.getElementById('field_0').checked;
	chekcboxes[1] = document.getElementById('field_1').checked;
	chekcboxes[2] = document.getElementById('field_2').checked;
	chekcboxes[3] = document.getElementById('field_3').checked;
	chekcboxes[4] = document.getElementById('field_4').checked;
	chekcboxes[5] = document.getElementById('field_5').checked;

	for (var n = 1; n < 5; n++){
		if ( chekcboxes[n] == true ){
			for (var i = 0; i < W; i++) {
				for (var j = 0; j < H; j++){
					if (arrays[n][i][j] < 0){
						array[i][j] -= arrays[n][i][j];
					}else{
						array[i][j] += arrays[n][i][j];
					};
					if (array[i][j] > 1){
						array[i][j] = 1;
					}
				}
			}
		}
	}

	if ( chekcboxes[0] == true ){
		for (var i = 0; i < W; i++) {
			for (var j = 0; j < H; j++){
				if (arrays[0][i][j] == 1){
					array[i][j] = 1;
				}
			}
		}
	}

	return array;
}

