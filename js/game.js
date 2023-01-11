import * as THREE from 'three';
import { OrbitControls} from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

var scene, camera, renderer, cube, controls, droughts;

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
//load a cool checker piece from STL file
const loader = new STLLoader();
loader.load('../checkerPiece.stl', function(geometry) {
    // let checkerMesh = geometry.scene.children.find((child) => child.name === "CheckerPiece");
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xd0a92c }))
    mesh.scale.set(mesh.scale.x * .025, mesh.scale.y * .025, mesh.scale.z * .025)
    mesh.rotation.x += Math.PI ;
    mesh.position.y += .23 ;
    scene.add(mesh);
})

const light = new THREE.PointLight(0xffffff, 2, 200)
light.position.set(4.5, 10, 4.5);
scene.add(light);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 10;
// camera.lookAt(0, 0, 0);


controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(4.5, 0, 4.5)
//controls.enablePan = false; if you want to disable pan
//controls.maxPolarAngle = Math.PI/2; if you don't want to look under the board
controls.enableDamping = true;
window.requestAnimationFrame(animate);
}

function addCheckers(checkerMesh) {

}

function animate() {
controls.update();
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