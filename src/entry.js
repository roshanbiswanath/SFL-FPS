/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, AmbientLight, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
//import SeedScene from './objects/Scene.js';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import MODEL from './objects/SFL.glb'

let scene, camera, renderer, controls, myAvatar

init()

let myID = '1'

let roomObject = {
  placeURL: 'http://localhost:3001/SFL.glb',
  placeID: '1',
  placeName: 'SFL',
  members: {
    '1': {
      name: 'Member 1',
      avatarLink: 'https://i.imgur.com/1J8Q1Xy.jpg',
    },
    '2': {}
  }
}

let player


let keyPressed = {

}

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  window.requestAnimationFrame(onAnimationFrameHandler);
  renderer.render(scene, camera);
  //console.log(camera.position)
  updateCamera(camera, keyPressed)
  //seedScene.update && seedScene.update(timeStamp);
}
window.requestAnimationFrame(onAnimationFrameHandler);
// resize
const windowResizeHanlder = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

function loadPlace(url) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    scene.add(gltf.scene);
  });
}

function init() {
  scene = new Scene();
  camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.6, 1000);
  renderer = new WebGLRenderer({ antialias: true });
  //const seedScene = new SeedScene();
  // scene
  //scene.add(seedScene);
  scene.add(new AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-60, 100, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
  // camera
  camera.position.set(0, 8.5, 50);
  //camera.lookAt(new Vector3(0, 0, 0));
  // renderer

  loadPlace('http://localhost:3001/SFL.glb')
  loadAvatar('http://localhost:3001/Soldier.glb', { x: 0, y: 0, z: 50 }, { x: 5, y: 5, z: 5 })
  document.body.addEventListener(
    'click',
    function () {
      controls.lock()
    },
    false
  )



  controls = new PointerLockControls(camera, renderer.domElement);
  scene.add(controls.getObject());
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x7ec0ee, 1);
  // dom
  document.body.style.margin = 0;
  document.body.appendChild(renderer.domElement);
}

document.addEventListener('keydown', (e) => {
  keyPressed[e.code] = true
})
document.addEventListener('keyup', (e) => {
  keyPressed[e.code] = false
})

function updateCamera(cam, keys) {
  if (keys['KeyW']) {
    controls.moveForward(1)
  }
  if (keys['KeyS']) {
    controls.moveForward(-1)
  }
  if (keys['KeyA']) {
    controls.moveRight(-1)
  }
  if (keys['KeyD']) {
    controls.moveRight(1)
  }
  /*
  if (keys['Space']) {
    cam.position.y += 1
  }
  if (keys['ShiftLeft']) {
    cam.position.y -= 1
  }*/
  myAvatar.position.set(camera.position.x, camera.position.y - 8.5, camera.position.z)
  //myAvatar.lookAt(camera.getWorldDirection())
  //myAvatar.applyQuaternion(camera.quaternion)
  //myAvatar.quaternion.rotateTowards(camera.quaternion, 100);
  //myAvatar.rotation.y = camera.rotation.y
  //console.log(myAvatar.rotation.y, camera.rotation.y)
  //myAvatar.rotation.set(cam.rotation.x, cam.rotation.y, 0)
}
/*
const onKeyDown = function (event) {
  switch (event.code) {
    case 'KeyW':
      controls.moveForward(1)
      break
    case 'KeyA':
      controls.moveRight(-1)
      break
    case 'KeyS':
      controls.moveForward(-1)
      break
    case 'KeyD':
      controls.moveRight(1)
      break
  }
}
*/
//document.addEventListener('keydown', onKeyDown, false)

function loadAvatar(url, position, scale) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    myAvatar = gltf.scene
    gltf.scene.position.set(position.x, position.y, position.z)
    gltf.scene.scale.set(scale.x, scale.y, scale.z)
    scene.add(gltf.scene);
  });
}