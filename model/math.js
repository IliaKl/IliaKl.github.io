
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

	mass = 0.5;
	var circl = circle(W, H, circleRad, circleX, circleY, mass);

	for (var i = 0; i < W; i++) {
		for (var j = 0; j < H; j++){
			array[i][j] += circl[i][j];
		}
	}

	return array;
}


function circle(W, H, rad, x0, y0, m) {

	var array  = fillMathAraay(W, H);

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


function circlePolar(W, H, rad, x0, y0) {

	var array  = [[/* fi */],[/* x */],[/* y */]];

	var x1, x2, x3, x4, y1, y2, y3, y4;

	x1 = x0 + rad;
	y1 = y0;
	var i = -1;

	for ( ; x1 >= x0; ) {

		x2 = x0 - x1 + x0;
		y2 = y1;
		x3 = x1;
		y3 = y0 - y1 + y0;
		x4 = x0 - x1 + x0;
		y4 = y0 - y1 + y0;

		if ( x1 >= 0 && y1 >= 0 && x1 < W && y1 < H ) {
			array[1][++i] = x1;
			array[2][i] = y1;
		}
		if ( x2 >= 0 && y2 >= 0 && x2 < W && y2 < H ) {
			array[1][++i] = x2;
			array[2][i] = y2;
		}
		if ( x3 >= 0 && y3 >= 0 && x3 < W && y3 < H ) {
			array[1][++i] = x3;
			array[2][i] = y3;
		}
		if ( x4 >= 0 && y4 >= 0 && x4 < W && y4 < H ) {
			array[1][++i] = x4;
			array[2][i] = y4;
		}

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

	var x1, y1, x0, y0, x, y, fi;
	for(var i = 0; i < array[1].length; i++){
		fi = 0;
		x1 = array[1][i];
		y1 = array[2][i];
		x = x1 - x0;
		y = y1 - y0;

		if ( x > 0 && y >= 0)	fi = Math.atan( y / x );
		if ( x > 0 && y < 0)	fi = Math.atan( y / x ) + 2 * Math.PI;
		if ( x < 0 )			fi = Math.atan( y / x ) + Math.PI;
		if ( x == 0 && y > 0 )	fi = Math.PI / 2;
		if ( x == 0 && y < 0 )	fi = 3 * Math.PI / 2;

		array[0][i] = fi;
	}

	return array;
}


function createDynamicXArray(line, W, H){ // add circle
	var array = fillMathAraay(W, H);
	for(var i = 0; i < W; i++){
		for(var j = ~~line[i]; j < H; j++){
			array[i][j] = 0.2;
		}
	}
	return array;
}


function createDynamicYArray(line, W, H){ // add circle
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
		var n = 0.2;
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


function createThresholdArrays(W, H, circleRad, circleX, circleY){
	var arrayX = fillMathAraay(W, H);
	var arrayY = fillMathAraay(W, H);

	for(var i = 0; i < W; i++){
		for(var n = 1; n < 3; n++){
			arrayX[i][H - n] = i;
			arrayY[i][H - n] = H - 3;
		}
	}

	var circl = circle(W, H, circleRad, circleX, circleY, 1);

	function aCircle(){
		var aCircl = fillMathAraay(W, H);
		var x1, y1, x2, y2, x3, y3, x4, y4;

		for(var i = circleX; i < circleX + circleRad; i++){
			for(var j = circleY; j < circleY + circleRad; j++){
				if( circl[i][j] != 0 ){
					break;
				};

				x1 = i;
				y1 = j;
				x2 = 2 * circleX - x1;
				y2 = y1;
				x3 = x1;
				y3 = 2 * circleY - y1;
				x4 = 2 * circleX - x1;
				y4 = 2 * circleY - y1;

				if( (x1 >= 0) && (y1 >= 0) ) aCircl[x1][y1] = 1;
				if( (x2 >= 0) && (y2 >= 0) ) aCircl[x2][y2] = 1;
				if( (x3 >= 0) && (y3 >= 0) ) aCircl[x3][y3] = 1;
				if( (x4 >= 0) && (y4 >= 0) ) aCircl[x4][y4] = 1;
			}
		}
		return aCircl;
	}

	var aCircl = aCircle();

	var circlPolar = circlePolar(W, H, circleRad, circleX, circleY);
	//console.log(circlPolar[0].length);

	function M(){
		for (var i = 0; i < W; i++) {
			for (var j = 0; j < H; j++) {
				if ( aCircl[i][j] == 1) {
					var x1 = i;
					var y1 = j;
					var x0 = circleX;
					var y0 = circleY;
					var x = x1 - x0;
					var y = y1 - y0;

					var fi = 0;
					if ( x > 0 && y >= 0)	fi = Math.atan( y / x );
					if ( x > 0 && y < 0)	fi = Math.atan( y / x ) + 2 * Math.PI;
					if ( x < 0 )			fi = Math.atan( y / x ) + Math.PI;
					if ( x == 0 && y > 0 )	fi = Math.PI / 2;
					if ( x == 0 && y < 0 )	fi = 3 * Math.PI / 2;

					var n = 0;
					var error = circleRad;
					var error_l = circleRad;
					for(var k = 0; k < circlPolar[0].length; k++){
						error_l = Math.abs(fi - circlPolar[0][k]);
						if (error_l < error) {
							n = k;
							error = error_l;
						}
					}



					/*var ro = circleRad;
					var xn = ro * Math.cos( fi ) + circleX;
					var yn = ro * Math.sin( fi ) + circleY;
					if ( xn < 0 )		xn = 0;
					if ( xn > W - 1 )	xn = W - 1;
					if ( yn < 0 )		yn = 0;
					if ( yn > H - 1 )	yn = H - 1;*/

					arrayX[i][j] = circlPolar[1][n];
					arrayY[i][j] = circlPolar[2][n];

					//arrayX[circlPolar[1][n]][circlPolar[2][n]] = 1;
					//arrayY[circlPolar[1][n]][circlPolar[2][n]] = 1;
				}
			}
		}
		var arrayM = [arrayX, arrayY];
		return arrayM;
	}

	var array = M();
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

		// threshold
	if ( chekcboxes[5] == true ){
		for (var i = 0; i < W; i++) {
			for (var j = 0; j < H; j++){
				if (arrays[5][i][j] || arrays[6][i][j] != 0){
					array[i][j] = 0.03; // 0.03
				}
			}
		}
	}

		// border, (sketch)
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


function sumData(W, H, array1, array2, array3){
	if ( array1 === undefined ) array1 = fillMathAraay(W, H);
	if ( array2 === undefined ) array2 = fillMathAraay(W, H);
	if ( array3 === undefined ) array3 = fillMathAraay(W, H);

	var array = fillMathAraay(W, H);

	for(var i = 0; i < W; i++){
		for(var j = 0; j < H; j++){
			array[i][j] = array1[i][j] + array2[i][j] + array3[i][j];
		}
	}

	return array;
}

