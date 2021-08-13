import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Snow }  from  './snow.js'
const Common = require("./lib/common.js")

function randomRange(min, max) {
	return ((Math.random()*(max-min)) + min); 
}

let SCREEN_WIDTH  = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight
let windowHalfX   = window.innerWidth / 2
let windowHalfY   = window.innerHeight / 2

const container = document.body

let renderer, scene, camera, stats

let mouseX = 0
let mouseY = 0

let particles = []; 

init()
animate()

function init() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 1000
	scene.add(camera);

  let particleImage = new Image();
  particleImage.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82015/snowflake.png'; 
  let material = new THREE.ParticleBasicMaterial( { 
    color: 0xffffff, 
    side: THREE.DoubleSide, 
    //map: new THREE.Texture(particleImage) 
  } );
		
	for (var i = 0; i < 3000; i++) {

		const particle = new Snow( material )
		scene.add( particle.sprite );
		
		particles.push(particle); 
	}

	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize )

  stats = new Stats();
  document.body.appendChild( stats.dom );

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {

  for (let i = 0; i < particles.length; i++)	{

    const particle = particles[i]; 
    particle.updatePhysics(); 

    const p = particle.position

    if      ( p.y < -1000 ) p.y += 2000

    if      ( p.x >  1000 ) p.x -= 2000
    else if ( p.x < -1000 ) p.x += 2000

    if      ( p.z > 1000  ) p.z -= 2000
    else if ( p.z < -1000 ) p.z += 2000

  }

	camera.position.x += (   mouseX - camera.position.x ) * 0.05
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05
	camera.lookAt(scene.position)

	renderer.render(scene, camera)		
  stats.update()
}
