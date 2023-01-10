import * as THREE from 'https://unpkg.com/three/build/three.module.js';

var scene, camera, renderer, cube;

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const square = new THREE.BoxGeometry(1, 0.1, 1);

}