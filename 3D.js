
var container, scene, camera, renderer, controls;
var positions;
	var positions_crossbar;
	var positions_crossbar_d;
//var lines = 1000;
var buffer_geometry;
	var buffer_geometry_crossbar;
	var buffer_geometry_crossbar_d;

var fibersData = [];
var ArrayDeltaY = [];

var minX, maxX, lengthFiber, sizeY, sizeZ, timeSpeed;

minX = -800;
maxX = 800;
lengthFiber =50;
sizeY = 100;
sizeZ = 100;
timeSpeed = 10;


fibersData = [
	[],		// x1
	[],		// y1
	[],		// y01
	[],		// z1

	[],		// x2
	[],		// y2
	[],		// y02
	[],		// z2

	[]		// time
];



function createModelArrayY (n) {
	/*for (var i = 0; i < n + 1; i++) {
		ArrayDeltaY[i] = (0.5 + (n - i) / n * 0.5);
		//ArrayDeltaY[i] = 1;

	}*/

	for (var i = 0; i < n/2; i++) {
		ArrayDeltaY[i] = ((n - i) / n);
		//ArrayDeltaY[i] = 1;

	}

	for (var i = n/2; i < n + 1; i++) {
		ArrayDeltaY[i] = 0.5;
		//ArrayDeltaY[i] = 1;

	}

	for (var i = 0; i < n; i++ ) {

		let pozY = (320-Math.sqrt(300*300-(i+minX)*(i+minX)))/100;
		//console.log(pozY);
		if(ArrayDeltaY[i] > pozY){
			//break;
			ArrayDeltaY[i] = pozY;
		}
		
	}

	for (var i = 30; i < n-30; i++ ) {
		let y0 = ArrayDeltaY[i-30];
		let y1 = ArrayDeltaY[i];
		let y2 = ArrayDeltaY[i+30];

		let q = 0.01;

		if( y1 > (y0+y2)/2+q ){
			ArrayDeltaY[i] = (y0+y2)/2+q;
		}

		if( y1 < (y0+y2)/2-q*10 ){
			ArrayDeltaY[i] = (y0+y2)/2-q*10;
		}
	}

	/*for (var i = 1; i < n; i++ ) {
		let y0 = ArrayDeltaY[i-1];
		let y1 = ArrayDeltaY[i];
		let y2 = ArrayDeltaY[i+1];

		if( (y1-y0+0.00005) < (y2-y1) ){
			ArrayDeltaY[i+1] = y1+y1-y0+0.00005;
		}
	}

	for (var i = n; i > 1; i-- ) {
		let y0 = ArrayDeltaY[i-1];
		let y1 = ArrayDeltaY[i];
		let y2 = ArrayDeltaY[i+1];

		if( (y1-y0) > (y2-y1+0.01) ){
			ArrayDeltaY[i-1] = y1-y2-y1+0.01;
		}
	}
	*/
/*
	var m = ~~(n/3);
	for (var i = m; i < 2*m; i++){
		ArrayDeltaY[i] = 0.6 + 0.4 * Math.sin(Math.PI * i/m) ;
	}

	for (var i = n/2; i < n + 1; i++) {
		ArrayDeltaY[i] = 0.2;
	}
*/
	
	

				/*
				let string;
				for (var i = 0; i < n + 1; i++) {
					string = string + ArrayDeltaY[i] + '</br>';
				}
				let div = document.createElement('div');

				//let textNode = document.createTextNode(string);
				//document.body.append(textNode);
				div.innerHTML = string;
					document.body.append(div);
				*/
}


function firstCreateFibers(n) {

	var createTime = new Date();

	for (var i = 0; i < n; i++){

		let x = Math.random() * (maxX - minX - lengthFiber) + minX; /*(Math.random() * (maxX - minX - lengthFiber)) + */

		let x1 = x;
		let y01 = Math.random() * sizeY * 2 - sizeY;
		let z1 = Math.random() * sizeZ * 2 - sizeZ;

		let x2 = x + lengthFiber * 0.5 + Math.random() * lengthFiber;
		let y02 = y01;
		let z2 = z1;

		let a1 = ~~(x1) - minX;
		let a2 = ~~(x2) - minX;

		let y1 = y01 * ArrayDeltaY[ a1 ];
		let y2 = y02 * ArrayDeltaY[ a2 ];

		fibersData[0][i] = x1;
		fibersData[1][i] = y1;
		fibersData[2][i] = y01;
		fibersData[3][i] = z1;
		fibersData[4][i] = x2;
		fibersData[5][i] = y2;
		fibersData[6][i] = y02;
		fibersData[7][i] = z2;
		fibersData[8][i] = createTime;

	/*	
	fibersData = [
		[0],		// x1
		[1],		// y1
		[2],		// y01
		[3],		// z1

		[4],		// x2
		[5],		// y2
		[6],		// y02
		[7],		// z2

		[8]		// time
	];*/
	}
}


function nextCreateFibers(i, createTime) {

	let x1 = minX;
	let y01 = Math.random() * sizeY * 2 - sizeY;
	let z1 = Math.random() * sizeZ * 2 - sizeZ;

	let x2 = minX + lengthFiber * 0.5 + Math.random() * lengthFiber;
	let y02 = y01;
	let z2 = z1;

	let a1 = ~~(x1) - minX;
	let a2 = ~~(x2) - minX;

	let y1 = y01 * ArrayDeltaY[ a1 ];
	let y2 = y02 * ArrayDeltaY[ a2 ];

	fibersData[0][i] = x1;
	fibersData[1][i] = y1;
	fibersData[2][i] = y01;
	fibersData[3][i] = z1;
	fibersData[4][i] = x2;
	fibersData[5][i] = y2;
	fibersData[6][i] = y02;
	fibersData[7][i] = z2;
	fibersData[8][i] = createTime;

}


function updateFibers( n ) {

	var timeNow = new Date();

	for (var i = 0; i < n; i++) {

		let x = (timeNow - fibersData[8][i]) / timeSpeed;
		fibersData[0][i] = fibersData[0][i] + x;
		fibersData[4][i] = fibersData[4][i] + x;

		if (fibersData[4][i] >= maxX) {
			nextCreateFibers(i, timeNow);
		};

		let a1 = ~~(fibersData[0][i]) - minX;
		let a2 = ~~(fibersData[4][i]) - minX;

		fibersData[1][i] = fibersData[2][i] * ArrayDeltaY[ a1 ];
		fibersData[5][i] = fibersData[6][i] * ArrayDeltaY[ a2 ];

		fibersData[8][i] = timeNow;
	}
}


function createGeomData() {
    
    for ( var i = 0; i < lines; i++ ) {

    	positions[ i * 6 + 0 ] = fibersData[0][i];
        positions[ i * 6 + 1 ] = fibersData[1][i];
        positions[ i * 6 + 2 ] = fibersData[3][i];
        positions[ i * 6 + 3 ] = fibersData[4][i];
        positions[ i * 6 + 4 ] = fibersData[5][i];
        positions[ i * 6 + 5 ] = fibersData[7][i];
    };
}


function add_lines_buffer_geom() {
    buffer_geometry = new THREE.BufferGeometry();
    buffer_geometry.dynamic = true;
    buffer_geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(lines * 6), 3 ));
    positions = buffer_geometry.attributes.position.array;
    createGeomData();
    buffer_geometry.computeBoundingSphere();
    var material = new THREE.LineBasicMaterial({ color: 0x0, opacity: 0.2, transparent: true });
    var buffer_mesh = new THREE.LineSegments( buffer_geometry, material );
    scene.add( buffer_mesh );
}


function animate() {
	if ( switch3D == true ){
		requestAnimationFrame(animate);
	    updateFibers(lines);
	    createGeomData();
	    buffer_geometry.attributes.position.needsUpdate = true;
	    buffer_geometry.computeBoundingSphere();

	    	//buffer_mesh_crossbar.rotateX ( 0.01 );
	    	crossbarGeomUpdate(24, 300);
	    	buffer_geometry_crossbar.attributes.position.needsUpdate = true;
	    	buffer_geometry_crossbar.computeBoundingSphere();

	    	buffer_geometry_crossbar_d.attributes.position.needsUpdate = true;
	    	buffer_geometry_crossbar_d.computeBoundingSphere();

	    renderer.render(scene, camera);
	}
}


function init (){
	container = document.getElementById( 'container' );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	//scene.background = new THREE.Color( 0x02142d );
	camera = new THREE.PerspectiveCamera( 45, container.offsetWidth/container.offsetHeight, 0.1, 10000 );
	renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//camera.position.x = (minX+maxX)/2;
	camera.position.z = 1000;

		rollers();

	createModelArrayY( maxX - minX );

	firstCreateFibers(lines);

	add_lines_buffer_geom();

	createGeomData();

		crossbar()

	animate();
}


function clearMem() {
container = NaN;
scene = NaN;
camera = NaN;
renderer = NaN;
controls = NaN;
positions = NaN;
buffer_geometry = NaN;
ArrayDeltaY = [NaN];
fibersData = [
	[NaN],		// x1
	[NaN],		// y1
	[NaN],		// y01
	[NaN],		// z1

	[NaN],		// x2
	[NaN],		// y2
	[NaN],		// y02
	[NaN],		// z2

	[NaN]		// time
];
}




function additionalLines() {
	var materialR = new THREE.LineBasicMaterial({
	color: 0xff0000, opacity: 0.3, transparent: true });
	var materialB = new THREE.LineBasicMaterial({
	color: 0x0000ff, opacity: 0.5, transparent: true });

var geometry_1 = new THREE.Geometry();
geometry_1.vertices.push(
	new THREE.Vector3( -10, -sizeY-10, 0 ),
	new THREE.Vector3( 0, -sizeY, 0 ),
	new THREE.Vector3( 0, -sizeY, 0 ),
	new THREE.Vector3( 10, -sizeY-10, 0 ),
	new THREE.Vector3( -10, sizeY+10, 0 ),
	new THREE.Vector3( 0, sizeY, 0 ),
	new THREE.Vector3( 0, sizeY, 0 ),
	new THREE.Vector3( 10, sizeY+10, 0 ),

	new THREE.Vector3( minX*0.9-10, -sizeY-10, 0 ),
	new THREE.Vector3( minX*0.9, -sizeY, 0 ),
	new THREE.Vector3( minX*0.9, -sizeY, 0 ),
	new THREE.Vector3( minX*0.9+10, -sizeY-10, 0 ),
	new THREE.Vector3( minX*0.9-10, sizeY + 10, 0 ),
	new THREE.Vector3( minX*0.9, sizeY, 0 ),
	new THREE.Vector3( minX*0.9, sizeY, 0 ),
	new THREE.Vector3( minX*0.9+10, sizeY+10, 0 ),

	new THREE.Vector3( maxX*0.9-10, -sizeY-10, 0 ),
	new THREE.Vector3( maxX*0.9, -sizeY, 0 ),
	new THREE.Vector3( maxX*0.9, -sizeY, 0 ),
	new THREE.Vector3( maxX*0.9+10, -sizeY-10, 0 ),
	new THREE.Vector3( maxX*0.9-10, sizeY+10, 0 ),
	new THREE.Vector3( maxX*0.9, sizeY, 0 ),
	new THREE.Vector3( maxX*0.9, sizeY, 0 ),
	new THREE.Vector3( maxX*0.9+10, sizeY+10, 0 )
);

var geometry_2 = new THREE.Geometry();
geometry_2.vertices.push(
	new THREE.Vector3( minX-10, 0, -sizeZ ),
	new THREE.Vector3( maxX+10, 0, -sizeZ ),
	new THREE.Vector3( minX-10, 0, sizeZ ),
	new THREE.Vector3( maxX+10, 0, sizeZ )
);

var line_1 = new THREE.LineSegments( geometry_1, materialB );
var line_2 = new THREE.LineSegments( geometry_2, materialR );

scene.add( line_1, line_2 );
}


function rollers() {

var rolls_segments = 64;
var roll_rad = 300;
var deltaRadRoll = 2*Math.PI/rolls_segments;

var roll_fi = 0;

var npr = 18;
var buffer_geometry_rolls;
buffer_geometry_rolls = new THREE.BufferGeometry();
buffer_geometry_rolls.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(rolls_segments * npr), 3 ));
var positions_rolls = buffer_geometry_rolls.attributes.position.array;

var xr1 = roll_rad*Math.cos(roll_fi);
var yr1 = roll_rad*Math.sin(roll_fi);
var xr2 = 0;
var yr2 = 0;

	for ( var i = 0; i < rolls_segments; i++ ) {
		roll_fi += deltaRadRoll;
		xr2 = roll_rad*Math.cos(roll_fi);
		yr2 = roll_rad*Math.sin(roll_fi);

    	positions_rolls[ i * npr + 0 ] = xr1;
        positions_rolls[ i * npr + 1 ] = yr1;
        positions_rolls[ i * npr + 2 ] = -sizeZ;
        positions_rolls[ i * npr + 3 ] = xr2;
        positions_rolls[ i * npr + 4 ] = yr2;
        positions_rolls[ i * npr + 5 ] = -sizeZ;

        positions_rolls[ i * npr + 0 + 6 ] = xr1;
        positions_rolls[ i * npr + 1 + 6 ] = yr1;
        positions_rolls[ i * npr + 2 + 6 ] = sizeZ;
        positions_rolls[ i * npr + 3 + 6 ] = xr2;
        positions_rolls[ i * npr + 4 + 6 ] = yr2;
        positions_rolls[ i * npr + 5 + 6 ] = sizeZ;

        positions_rolls[ i * npr + 0 + 6 + 6 ] = xr1;
        positions_rolls[ i * npr + 1 + 6 + 6 ] = yr1;
        positions_rolls[ i * npr + 2 + 6 + 6 ] = 0;
        positions_rolls[ i * npr + 3 + 6 + 6 ] = xr2;
        positions_rolls[ i * npr + 4 + 6 + 6 ] = yr2;
        positions_rolls[ i * npr + 5 + 6 + 6 ] = 0;

        xr1 = xr2;
		yr1 = yr2;
    };

var material_rolls = new THREE.LineBasicMaterial({ color: 0x0000ff, opacity: 0.4, transparent: true });
var buffer_mesh_rolls = new THREE.LineSegments( buffer_geometry_rolls, material_rolls );
buffer_mesh_rolls.position.set(0,roll_rad+sizeY*0.2,0);
scene.add( buffer_mesh_rolls );

var buffer_mesh_rolls_d = buffer_mesh_rolls.clone();
buffer_mesh_rolls_d.position.set(0,-roll_rad-sizeY*0.2,0);
scene.add( buffer_mesh_rolls_d );
}


function crossbar() {
var crossbar_segments = 24;
var roll_rad = 300;
buffer_geometry_crossbar = new THREE.BufferGeometry();
buffer_geometry_crossbar.dynamic = true;
buffer_geometry_crossbar.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(crossbar_segments * 6), 3 ));
positions_crossbar = buffer_geometry_crossbar.attributes.position.array;

buffer_geometry_crossbar_d = new THREE.BufferGeometry();
buffer_geometry_crossbar_d.dynamic = true;
buffer_geometry_crossbar_d.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(crossbar_segments * 6), 3 ));
positions_crossbar_d = buffer_geometry_crossbar_d.attributes.position.array;

crossbarGeomUpdate(crossbar_segments, roll_rad);

buffer_geometry_crossbar.computeBoundingSphere();
var material_crossbar = new THREE.LineBasicMaterial({ color: 0x0000ff, opacity: 0.2, transparent: true });
var buffer_mesh_crossbar = new THREE.LineSegments( buffer_geometry_crossbar, material_crossbar );
buffer_mesh_crossbar.position.set(0,roll_rad+sizeY*0.2,0);
scene.add( buffer_mesh_crossbar );

buffer_geometry_crossbar_d.computeBoundingSphere();
var buffer_mesh_crossbar_d = new THREE.LineSegments( buffer_geometry_crossbar_d, material_crossbar );
buffer_mesh_crossbar_d.position.set(0,-(roll_rad+sizeY*0.2),0);
scene.add( buffer_mesh_crossbar_d );
}


function crossbarGeomUpdate(crossbar_segments, roll_rad) {
	var timeNow = new Date();
	var deltaRadCrossbar = 2*Math.PI/crossbar_segments;
	let x = (timeNow / 300)  / (timeSpeed);
	var crossbar_fi = x;
	var xc1 = 0;
	var yc1 = 0;
	for ( var i = 0; i < crossbar_segments; i++ ) {
		crossbar_fi += deltaRadCrossbar;
		xc1 = roll_rad*Math.cos(crossbar_fi);
		yc1 = roll_rad*Math.sin(crossbar_fi);
    	positions_crossbar[ i * 6 + 0 ] = xc1;
        positions_crossbar[ i * 6 + 1 ] = yc1;
        positions_crossbar[ i * 6 + 2 ] = -sizeZ;
        positions_crossbar[ i * 6 + 3 ] = xc1;
        positions_crossbar[ i * 6 + 4 ] = yc1;
        positions_crossbar[ i * 6 + 5 ] = sizeZ;
    };

	crossbar_fi = -x;
	var xc1 = 0;
	var yc1 = 0;
	for ( var i = 0; i < crossbar_segments; i++ ) {
		crossbar_fi += deltaRadCrossbar;
		xc1 = roll_rad*Math.cos(crossbar_fi);
		yc1 = roll_rad*Math.sin(crossbar_fi);
    	positions_crossbar_d[ i * 6 + 0 ] = xc1;
        positions_crossbar_d[ i * 6 + 1 ] = yc1;
        positions_crossbar_d[ i * 6 + 2 ] = -sizeZ;
        positions_crossbar_d[ i * 6 + 3 ] = xc1;
        positions_crossbar_d[ i * 6 + 4 ] = yc1;
        positions_crossbar_d[ i * 6 + 5 ] = sizeZ;
    };
}
