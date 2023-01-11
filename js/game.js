import * as THREE from 'three';
import { OrbitControls} from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { MeshPhongMaterial } from 'three';

var scene, camera, renderer, cube, controls, checkersGameLogic, board;

function init() {
    checkersGameLogic = new CheckersGameLogic();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const square = new THREE.BoxGeometry(1, 0.1, 1); //length, height, width
    const lightsquare = new THREE.MeshBasicMaterial({color:  0x332940} ) ; 
    const darksquare = new THREE.MeshBasicMaterial({color: 0x121212 } ) ;

    board = new THREE.Group();

    let squareNumber = 1;

    for (let x = 0; x < 10; x++) {
        for (let z = 0; z < 10; z++) {
            if (z % 2 == 0) {
                cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
                if (x % 2 != 0) {
                    cube.userData.squareNumber = squareNumber;
                    squareNumber++;
                }
            } else {
                cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
                if (x % 2 == 0) {
                    cube.userData.squareNumber = squareNumber;
                    squareNumber++;
                }
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
        // scene.add(mesh);
        addCheckers(mesh);
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

function positionForSquare(square) {
    const found = board.children.find((child) => child.userData.squareNumber == square);
    if (found) {
        console.log(found.position)
        return found.position;
    }
    return null;
}

function addCheckers(checkerMesh) {
    for (let i = 0; i<51; i++) {
        let pieceOn = checkersGameLogic.get(i);
        const piece = checkerMesh.clone(true);
        const squarePosition = positionForSquare(i);
        if (pieceOn === 'b') {
            piece.material = new THREE.MeshPhongMaterial({color: 0x222222});
            piece.userData.color = 'b'
            piece.userData.currentSquare = i;
            piece.position.set(squarePosition.x, piece.position.y, squarePosition.z);
            scene.add(piece);

        } else if (pieceOn === 'w') {
            piece.material = new THREE.MeshPhongMaterial({color: 0xd0a92c });
            piece.userData.color = 'w';
            piece.userData.currentSquare = i;
            piece.position.set(squarePosition.x, piece.position.y, squarePosition.z);
            scene.add(piece);

        }
    }
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