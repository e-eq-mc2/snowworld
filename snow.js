const THREE = require('three');
const Common     = require("./lib/common.js")
const Colormap   = require("./lib/colormap.js")

// Particle3D class

const TO_RADIANS = Math.PI/180.0

export class Snow {

  constructor(num, rangeMin = -1000, rangeMax = 1000) {
    this.num = num
    this.rangeMinX = rangeMin
    this.rangeMaxX = rangeMax
    this.rangeMinY = rangeMin/2
    this.rangeMaxY = rangeMax/2
    this.rangeMinZ = rangeMin/2
    this.rangeMaxZ = rangeMax/2


    this.colormap   = new Colormap('white')
    this.colormap.setBlackRate(0.0)

    const positions = new Float32Array(this.num * 3)
    const colors    = new Float32Array(this.num * 3)

    const color = new THREE.Color()
    for (let i = 0; i < this.num; i++) {
      const x = Common.randomReal(this.rangeMinX, this.rangeMaxX) 
      const y = Common.randomReal(this.rangeMinY, this.rangeMaxY)
      const z = Common.randomReal(this.rangeMinZ, this.rangeMaxZ)

      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      color.set( this.colormap.choose() )
      const r = color.r
      const g = color.g
      const b = color.b

      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute(   'color', new THREE.BufferAttribute(   colors, 3))

    //const fileName = `img/fish_10.png`
    const fileName = `img/snowflake.png`
    const texture  = new THREE.TextureLoader().load( fileName )

    const material = new THREE.PointsMaterial({
      color: 0xffffff, 
      size: 40, 
      map: texture, 
      transparent: true, 
      vertexColors: true,
      blending: THREE.AdditiveBlending, 
      depthTest: false, 
    });


    this.flakes = new THREE.Points( geometry, material );

    this.velocities = []
    this.gravities  = []
    this.drags      = []

    for (let i = 0; i < this.num; i++) {
      const v = new THREE.Vector3(0, -2, 0)
      const g = new THREE.Vector3(0,0,0)
      const d = 1

      this.rotateX(v, Common.random(-45,  45) * TO_RADIANS) 
      this.rotateY(v, Common.random(  0, 360) * TO_RADIANS)

      this.velocities.push(v)
      this.gravities.push(g)
      this.drags.push(d)
    }

  }

  changeColor() {
    const colors = this.flakes.geometry.attributes.color.array

    const color = new THREE.Color()
    for (let i = 0; i < this.num; i++) {
      color.set( this.colormap.choose() )
      const r = color.r
      const g = color.g
      const b = color.b

      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    this.flakes.geometry.attributes.color.needsUpdate = true
  }

  updatePhysics() {
    const positions = this.flakes.geometry.attributes.position.array

    const rangeX = this.rangeMaxX - this.rangeMinX
    const rangeY = this.rangeMaxY - this.rangeMinY
    const rangeZ = this.rangeMaxZ - this.rangeMinZ
    for (let i = 0; i < this.num; i++) {
      const v = this.velocities[i]
      const g = this.gravities[i]
      const d = this.drags[i]

      v.multiplyScalar(d)
      v.add(g)

      let x = positions[i * 3 + 0]
      let y = positions[i * 3 + 1]
      let z = positions[i * 3 + 2]

      x += v.x
      y += v.y
      z += v.z

      if      ( y < this.rangeMinY ) y += rangeY

      if      ( x > this.rangeMaxX ) x -= rangeX
      else if ( x < this.rangeMinX ) x += rangeX

      if      ( z > this.rangeMaxZ ) z -= rangeZ
      else if ( z < this.rangeMinZ ) z += rangeZ

      positions[i * 3 + 0] = x 
      positions[i * 3 + 1] = y 
      positions[i * 3 + 2] = z 
    }

    this.flakes.geometry.attributes.position.needsUpdate = true
  }

  rotateX(v, angle) {
    const axis = new THREE.Vector3(1, 0, 0)
    v.applyAxisAngle(axis, angle)
    return v
  }

  rotateY(v, angle) {
    const axis = new THREE.Vector3(0, 1, 0)
    v.applyAxisAngle(axis, angle)
    return v
  }

  rotateZ(v, angle) {
    const axis = new THREE.Vector3(0, 0, 1)
    v.applyAxisAngle(axis, angle)
    return v
  }
}



