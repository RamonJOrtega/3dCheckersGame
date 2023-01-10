import * as THREE from 'three';
import { OrbitControls} from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var scene, camera, renderer, cube, controls;

function init() {

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const square = new THREE.BoxGeometry(1, 0.1, 1); //length, height, width
const lightsquare = new THREE.MeshBasicMaterial({color:  0x332940} ) ; 
const darksquare = new THREE.MeshBasicMaterial({color: 0x121212 } ) ;

const board = new THREE.Group();

for (let x = 0; x < 10; x++) {
    for (let z = 0; z < 10; z++) {
        // let cube;
        if (z % 2 == 0) {
            cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
        } else {
            cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
        }
        cube.position.set(x, 0, z);
        board.add(cube);
    }
}
scene.add(board);
camera.position.x = 0
camera.position.y = 3;
camera.position.z = 10;
camera.lookAt(5, 0, 10);

controls = new OrbitControls(camera, renderer.domElement)

window.requestAnimationFrame(animate);
}

function animate() {
renderer.render(scene, camera);
window.requestAnimationFrame(animate);

}

function onWindowResize() {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
window.onload = init;