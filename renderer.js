import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Snow }  from  './snow.js'
const Common = require("./lib/common.js")
const Colormap   = require("./lib/colormap.js")

const colormap   = new Colormap('white')
colormap.setBlackRate(0.0)

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

let snow

init()
animate()

function init() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(90, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 2000
	scene.add(camera);

  snow= new Snow(10000, -2000, 2000)
  scene.add( snow.flakes )

	container.appendChild( renderer.domElement );

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize )

  stats = new Stats();
  document.body.appendChild( stats.dom );


  const controls = new OrbitControls( camera, renderer.domElement );
  //controls.target.set( 0, 10, 0 );
  controls.update();

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

  snow.updatePhysics()

	//camera.position.x += (   mouseX - camera.position.x ) * 0.05
	//camera.position.y += ( - mouseY - camera.position.y ) * 0.05
	//camera.lookAt(scene.position)

	renderer.render(scene, camera)		
  stats.update()
}

//looks for key presses and logs them
document.body.addEventListener("keydown", function(e) {
  console.log(`key: ${e.key}`);

  switch(true) {
    case e.key == '0':
      colormap.set('black')
      break
    case e.key == '1':
      colormap.set('white')
      break
    case e.key == '2':
      colormap.set('blue-black')
      break
    case e.key == '3':
      colormap.set('aqua-black')
      break
    case e.key == '4':
      colormap.set('green-black')
      break
    case e.key == '5':
      colormap.set('yellow-black')
      break
    case e.key == '6':
      colormap.set('red-black')
      break
    case e.key == '7':
      colormap.set('rose-black')
      break
    case e.key == '8':
      colormap.set('purple-black')
      break
    case e.key == 'm':
      colormap.set('mix-black')
      break
    case e.key == 'p':
      window.api.send('竜とそばかすの姫_歌よ_Belle_中村佳穂.mp3', 'music')
      break

    case e.key == "b":
      {
        let b = Math.cbrt(colormap.getBlackRate())
        b += 0.1
        b = b ** 3
        colormap.setBlackRate(b)
      }
      break

    case e.key == "w":
      {

        let b = Math.cbrt(colormap.getBlackRate())
        b -= 0.1
        b = b >= 0 ? b ** 3 : 0
        colormap.setBlackRate(b)
      }
      break

    default:
      break
  }

  snow.changeColor(colormap.choose())
});


