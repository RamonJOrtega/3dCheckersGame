import * as THREE from 'three';
import { OrbitControls} from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { MeshPhongMaterial } from 'three';

var  scene, camera, renderer, cube, controls, checkersGameLogic, board, pointer, raycaster, selectedPiece = null;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    pointer = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    const light = new THREE.PointLight(0xffffff, 2, 200)
    light.position.set(4.5, 10, 4.5);
    scene.add(light);
    camera.position.x = 0;
    camera.position.y = 3;
    camera.position.z = 10; // camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(4.5, 0, 4.5) //controls.enablePan = false; if you want to disable pan
    controls.enableDamping = true;   //controls.maxPolarAngle = Math.PI/2; if you don't want to look under the board
    window.requestAnimationFrame(animate);


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
            cube.name = "cube";
            board.add(cube);
        }
    }
    board.name = "board";
    scene.add(board);
    
    const loader = new STLLoader(); 
    loader.load('../checkerPiece.stl', function(geometry) {
        let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xd0a92c }))
        mesh.scale.set(mesh.scale.x * .025, mesh.scale.y * .025, mesh.scale.z * .025)
        mesh.rotation.x += Math.PI ;
        mesh.position.y += .23 ;
        addCheckers(mesh); // scene.add(mesh);
    })
    checkersGameLogic = new CheckersGameLogic();

}

function positionForSquare(square) {
    const found = board.children.find((child) => child.userData.squareNumber == square);
    if (found) { return found.position; }
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

function hoverPieces() {
    raycaster.setFromCamera(pointer, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0 ; i<intersects.length; i++) {
        intersects[i].object.material.transparent = true;
        intersects[i].object.material.opacity = 0.5;
    }
}

function resetMaterials() {
    for (let i=0; i < scene.children.length; i++) {
        if(scene.children[i].material) {
            scene.children[i].material.opacity = scene.children[i].userData.currentSquare == selectedPiece ? 0.5 : 1.0;
            console.log(scene.children[i].name);
        }
    }
}

function animate() {
    controls.update();
    resetMaterials();
    hoverPieces();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove( event ) {// calculate pointer position in normalized device coordinates // (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onClick(event) {
    raycaster.setFromCamera(pointer, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    if (intersects[0].object.userData.currentSquare > 0) { //WAS MISTAKENLY if (intersects.length>0) in tutorial
      selectedPiece = intersects[0].object.userData.currentSquare;
      return;
    }
    console.log(selectedPiece)

    if (selectedPiece) {
        console.log("next");

      raycaster.setFromCamera(pointer, camera);
      intersects = raycaster.intersectObjects(board.children);
   
      if (intersects.length > 0 && intersects[0].object.userData.squareNumber) {
        const targetSquare = intersects[0].object.userData.squareNumber;
        //console.log(targetSquare)
        const selectedObject = scene.children.find((child) => child.userData.currentSquare == selectedPiece);
        if (!selectedObject || !targetSquare) return;
   
        const targetPosition = positionForSquare(targetSquare);
        selectedObject.position.set(targetPosition.x, selectedObject.position.y, targetPosition.z);
        selectedObject.currentSquare = targetSquare;
        selectedPiece = null;
      }
    }
  }

window.addEventListener('resize', onWindowResize);
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'click', onClick);
window.onload = init;