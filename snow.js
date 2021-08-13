const THREE = require('three');
const Common     = require("./lib/common.js")

// Particle3D class

const TO_RADIANS = Math.PI/180.0

export class Snow {

  constructor(material) {
    this.sprite = new THREE.Sprite(material)

    this.position = new THREE.Vector3(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    )

    this.sprite.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    ) 
    this.sprite.scale.set(10, 10, 10)
    this.velocity = new THREE.Vector3(0, -8, 0)

    this.rotateX(this.velocity, Common.random(-45,  45) * TO_RADIANS) 
    this.rotateY(this.velocity, Common.random(  0, 360) * TO_RADIANS)

    this.gravity = new THREE.Vector3(0,0,0); 
    this.drag = 1
  }

  updatePhysics() {
    this.velocity.multiplyScalar(this.drag)
    this.velocity.add(this.gravity )
    this.position.add(this.velocity)

    this.sprite.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    ) 
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
