var container, scene, camera, renderer, controls;
var positions;
//var lines = 1000;
var buffer_geometry;

var fibersData = [];
var ArrayDeltaY = [];

var minX, maxX, lengthFiber, sizeY, sizeZ, timeSpeed;

minX = -500;
maxX = 500;
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
	for (var i = 0; i < n + 1; i++) {
		ArrayDeltaY[i] = (0.5 + (n - i) / n * 0.5);
	}

	var m = ~~(n/3);
	for (var i = m; i < 2*m; i++){
		ArrayDeltaY[i] = 0.6 + 0.4 * Math.sin(Math.PI * i/m) ;
	}

	for (var i = n/2; i < n + 1; i++) {
		ArrayDeltaY[i] = 0.2;
	}
}


function firstCreateFibers(n) {

	var createTime = new Date();

	for (var i = 0; i < n; i++){

		let x = Math.random() * (maxX - minX - lengthFiber) + minX; /*(Math.random() * (maxX - minX - lengthFiber)) + */

		let x1 = x;
		let y01 = Math.random() * sizeY * 2 - sizeY;
		let z1 = Math.random() * sizeZ * 2 - sizeZ;

		let x2 = x + Math.random() * lengthFiber;
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

	let x2 = minX + Math.random() * lengthFiber;
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
    var material = new THREE.LineBasicMaterial({ color: 0x0, opacity: 0.7, transparent: true });
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
	    renderer.render(scene, camera);
	}
}


function init (){
	container = document.getElementById( 'container' );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	camera = new THREE.PerspectiveCamera( 75, container.offsetWidth/container.offsetHeight, 0.1, 10000 );
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//camera.position.x = (minX+maxX)/2;
	camera.position.z = 500;

	createModelArrayY( maxX - minX );

	firstCreateFibers(lines);

	add_lines_buffer_geom();

	createGeomData();

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