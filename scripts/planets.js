
let scene, camera, renderer, ring1, ring2, ring3, sphere;
let ADD = 0.02;

let createRingOne = function() {
    let geometry = new THREE.TorusGeometry(.7, .05, 2, 100, 6.3);
    let material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});

    ring1 = new THREE.Mesh(geometry, material);
    scene.add(ring1);
};

let createRingTwo = function() {
    let geometry = new THREE.TorusGeometry(.9, .05, 2, 100, 6.3);
    let material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});

    ring2 = new THREE.Mesh(geometry, material);
    scene.add(ring2);
};

let createSphere = function() {
    let geometry = new THREE.SphereGeometry(.5, 60, 200);
    let material = new THREE.MeshBasicMaterial({color: '#C45599', wireframe: true});

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
};

// set up the environment -
// initiallize scene, camera, objects and renderer
let init = function () {
    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xababab);

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1, 1000
    );
    camera.position.z = 5;

    createSphere();
    createRingOne();
    createRingTwo();

    let axes = new THREE.AxesHelper(5);
    scene.add(axes);

    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
};


// main animation loop - calls 50-60 in a second.
let mainLoop = function () {
    scene.rotation.x -= ADD;

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();
